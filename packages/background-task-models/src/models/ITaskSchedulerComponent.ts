// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IScheduledTaskInfo } from "./IScheduledTaskInfo.js";
import type { IScheduledTaskTime } from "./IScheduledTaskTime.js";

/**
 * Interface describing a task scheduler.
 */
export interface ITaskSchedulerComponent extends IComponent {
	/**
	 * Add a task to the scheduler.
	 * @param taskId The id of the task to add.
	 * @param times The times at which the task should be scheduled.
	 * @param taskCallback The callback to execute when the task is scheduled.
	 * @returns A promise that resolves when the task is registered with the scheduler
	 */
	addTask(
		taskId: string,
		times: IScheduledTaskTime[],
		taskCallback: () => Promise<void>
	): Promise<void>;

	/**
	 * Remove a task from the scheduler.
	 * @param taskId The id of the task to remove.
	 * @returns A promise that resolves when the task has been removed from the scheduler
	 */
	removeTask(taskId: string): Promise<void>;

	/**
	 * Get the information about the tasks.
	 * @returns The tasks information.
	 */
	tasksInfo(): Promise<IScheduledTaskInfo>;
}
