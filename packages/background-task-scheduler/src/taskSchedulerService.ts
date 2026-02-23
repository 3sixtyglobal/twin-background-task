// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IScheduledTaskInfo,
	IScheduledTaskTime,
	ITaskSchedulerComponent
} from "@twin.org/background-task-models";
import { BaseError, ComponentFactory, Is } from "@twin.org/core";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { ScheduledTask } from "./entities/scheduledTask.js";
import type { ITaskSchedulerConstructorOptions } from "./models/ITaskSchedulerConstructorOptions.js";

/**
 * Class for scheduling tasks.
 */
export class TaskSchedulerService implements ITaskSchedulerComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<TaskSchedulerService>();

	/**
	 * The logger for the task service.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The entity storage for the scheduled tasks.
	 * @internal
	 */
	private readonly _scheduledTaskEntityStorageConnector: IEntityStorageConnector<ScheduledTask>;

	/**
	 * The interval in milliseconds at which the tasks are checked.
	 * @internal
	 */
	private readonly _tickIntervalMs: number;

	/**
	 * The timeout in milliseconds after which an in-progress task is considered stalled.
	 * @internal
	 */
	private readonly _stalledTaskTimeoutMs: number;

	/**
	 * The tasks that are scheduled.
	 * @internal
	 */
	private readonly _tasks: {
		[id: string]: {
			times: IScheduledTaskTime[];
			taskCallback: () => Promise<void>;
		};
	};

	/**
	 * The tasks currently running in this scheduler instance.
	 * @internal
	 */
	private _runningTasks: string[];

	/**
	 * The timer for running scheduled tasks.
	 * @internal
	 */
	private _timer?: NodeJS.Timeout;

	/**
	 * Create a new instance of TaskSchedulerComponent.
	 * @param options The options for the scheduler.
	 */
	constructor(options?: ITaskSchedulerConstructorOptions) {
		this._scheduledTaskEntityStorageConnector = EntityStorageConnectorFactory.get(
			options?.scheduledTaskEntityStorageType ?? "scheduled-task"
		);
		this._logging = ComponentFactory.getIfExists(options?.loggingComponentType ?? "logging");
		this._tasks = {};
		this._runningTasks = [];
		this._tickIntervalMs = options?.config?.intervalMs ?? 60 * 1000; // 1 minute
		this._stalledTaskTimeoutMs = options?.config?.stalledTaskTimeoutMs ?? 5 * 60 * 1000; // 5 minutes
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return TaskSchedulerService.CLASS_NAME;
	}

	/**
	 * The component needs to be stopped when the node is closed.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async stop(nodeLoggingComponentType?: string): Promise<void> {
		this.stopTimer();

		// If we had any running tasks, we reset their last run time to allow them to be
		// triggered by other components
		for (const taskId of this._runningTasks) {
			await this._scheduledTaskEntityStorageConnector.set({
				id: taskId,
				lastRunTime: undefined
			});
		}
		this._runningTasks = [];
	}

	/**
	 * Add a task to the scheduler.
	 * @param taskId The id of the task to add.
	 * @param times The times at which the task should be scheduled.
	 * @param taskCallback The callback to execute when the task is scheduled.
	 * @returns Nothing.
	 */
	public async addTask(
		taskId: string,
		times: IScheduledTaskTime[],
		taskCallback: () => Promise<void>
	): Promise<void> {
		this._tasks[taskId] = {
			times: times.map(time => ({
				...time,
				nextTriggerTime: Is.empty(time.nextTriggerTime)
					? this.calculateNextTriggerTime(time)
					: time.nextTriggerTime
			})),
			taskCallback
		};

		await this._logging?.log({
			level: "info",
			source: TaskSchedulerService.CLASS_NAME,
			ts: Date.now(),
			message: "taskAdded",
			data: {
				id: taskId
			}
		});

		await this.startTimer();
	}

	/**
	 * Remove a task from the scheduler.
	 * @param taskId The id of the task to remove.
	 * @returns Nothing.
	 */
	public async removeTask(taskId: string): Promise<void> {
		if (!Is.empty(this._tasks[taskId])) {
			await this._logging?.log({
				level: "info",
				source: TaskSchedulerService.CLASS_NAME,
				ts: Date.now(),
				message: "taskRemoved",
				data: {
					id: taskId
				}
			});

			delete this._tasks[taskId];

			if (Object.keys(this._tasks).length === 0) {
				this.stopTimer();
			}
		}
	}

	/**
	 * Get the information about the tasks.
	 * @returns The tasks information.
	 */
	public async tasksInfo(): Promise<IScheduledTaskInfo> {
		const tasksInfo: IScheduledTaskInfo = {
			tasks: {}
		};
		for (const taskId in this._tasks) {
			tasksInfo.tasks[taskId] = this._tasks[taskId].times;
		}
		return tasksInfo;
	}

	/**
	 * Calculate the next run time for a task based on its scheduled times.
	 * @param time The times at which the task should be scheduled.
	 * @returns The update time with the next run.
	 * @internal
	 */
	private calculateNextTriggerTime(time: IScheduledTaskTime): number {
		let nextTriggerTime = time.nextTriggerTime;

		if (Is.empty(nextTriggerTime)) {
			nextTriggerTime = Date.now();
		}

		if (!Is.empty(time.intervalDays)) {
			nextTriggerTime += time.intervalDays * 24 * 60 * 60 * 1000;
		}

		if (!Is.empty(time.intervalHours)) {
			nextTriggerTime += time.intervalHours * 60 * 60 * 1000;
		}

		if (!Is.empty(time.intervalMinutes)) {
			nextTriggerTime += time.intervalMinutes * 60 * 1000;
		}

		return nextTriggerTime;
	}

	/**
	 * Start the timer for running scheduled tasks.
	 * @internal
	 */
	private async startTimer(): Promise<void> {
		if (Is.empty(this._timer)) {
			// Trigger immediately to catch up on any missed tasks
			await this.triggerScheduledTasks();
			// Set the timer to run at the specified interval
			this._timer = setInterval(async () => this.triggerScheduledTasks(), this._tickIntervalMs);
		}
	}

	/**
	 * Stop the timer for running scheduled tasks.
	 * @internal
	 */
	private stopTimer(): void {
		if (!Is.empty(this._timer)) {
			clearInterval(this._timer);
			this._timer = undefined;
		}
	}

	/**
	 * Trigger scheduled tasks based on their next run times.
	 * @internal
	 */
	private async triggerScheduledTasks(): Promise<void> {
		const now = Date.now();

		for (const taskId in this._tasks) {
			const task = this._tasks[taskId];

			for (const taskTime of task.times) {
				if (!Is.empty(taskTime.nextTriggerTime) && taskTime.nextTriggerTime <= now) {
					let taskStarted = false;

					try {
						const scheduledTask = await this._scheduledTaskEntityStorageConnector.get(taskId);
						const lastRunTime = scheduledTask?.lastRunTime;
						const taskInProgress = !Is.empty(lastRunTime);
						const taskStalled = taskInProgress && now - lastRunTime >= this._stalledTaskTimeoutMs;

						if (taskStalled) {
							await this._logging?.log({
								level: "warn",
								source: TaskSchedulerService.CLASS_NAME,
								ts: Date.now(),
								message: "taskStalled",
								data: {
									id: taskId,
									lastRunTime,
									stalledForMs: now - (lastRunTime ?? now),
									stalledTaskTimeoutMs: this._stalledTaskTimeoutMs
								}
							});
						}

						if (!taskInProgress || taskStalled) {
							await this._logging?.log({
								level: "info",
								source: TaskSchedulerService.CLASS_NAME,
								ts: Date.now(),
								message: "taskTriggered",
								data: {
									id: taskId,
									time: new Date(taskTime.nextTriggerTime).toISOString()
								}
							});

							// Update the last run time of the task to prevent multiple triggers in case of long running tasks
							await this._scheduledTaskEntityStorageConnector.set({
								id: taskId,
								lastRunTime: Date.now()
							});

							if (!this._runningTasks.includes(taskId)) {
								this._runningTasks.push(taskId);
							}

							taskStarted = true;
							await task.taskCallback();
						}
					} catch (error) {
						await this._logging?.log({
							level: "error",
							source: TaskSchedulerService.CLASS_NAME,
							ts: Date.now(),
							message: "taskFailed",
							data: {
								id: taskId
							},
							error: BaseError.fromError(error)
						});
					} finally {
						if (taskStarted) {
							// Reset the last run time to allow future triggers, even if the task callback fails
							await this._scheduledTaskEntityStorageConnector.set({
								id: taskId,
								lastRunTime: undefined
							});

							// Remove the task from the running tasks list
							const index = this._runningTasks.indexOf(taskId);
							if (index >= 0) {
								this._runningTasks.splice(index, 1);
							}
						}
					}

					// If the intervals are empty, we do not recalculate a next run time
					if (
						Is.empty(taskTime.intervalDays) &&
						Is.empty(taskTime.intervalHours) &&
						Is.empty(taskTime.intervalMinutes)
					) {
						taskTime.nextTriggerTime = undefined;
					} else {
						// Recalculate the next run time based on the current time and the intervals
						taskTime.nextTriggerTime = this.calculateNextTriggerTime(taskTime);
					}
				}
			}
		}
	}
}
