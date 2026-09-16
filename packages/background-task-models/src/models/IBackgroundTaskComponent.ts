// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { SortDirection } from "@twin.org/entity";
import type { IBackgroundTask } from "./IBackgroundTask.js";
import type { TaskStatus } from "./taskStatus.js";

/**
 * Interface describing a background task component.
 */
export interface IBackgroundTaskComponent extends IComponent {
	/**
	 * Register a handler for a task.
	 * @param taskType The type of the task the handler can process.
	 * @param module The module the handler is in.
	 * @param method The method in the module to execute.
	 * @param stateChangeCallback The callback to execute when the task state is updated.
	 * @param options Additional options for the task.
	 * @param options.maxWorkerCount The maximum number of workers in the pool.
	 * @param options.idleShutdownTimeout Terminate the worker after it has been idle for the specified timeout in milliseconds, defaults to 0 shutdown immediately, -1 to keep forever.
	 * @param options.initialiseMethod The initialisation method to call on the module when a worker is started.
	 * @param options.initialiseMethodParams Callback to provide additional parameters to spread when calling the initialiseMethod.
	 * @param options.shutdownMethod The shutdown method to call on the module when a worker is stopped.
	 * @param options.shutdownMethodParams Callback to provide additional parameters to spread when calling the shutdownMethod.
	 * @param options.executionTimeout Maximum time in milliseconds a task may run before it is marked as failed and the worker terminated. Omit for no limit.
	 * @returns A promise that resolves when the handler is registered
	 */
	registerHandler<T, U>(
		taskType: string,
		module: string,
		method: string,
		stateChangeCallback?: (task: IBackgroundTask<T, U>) => Promise<void>,
		options?: {
			maxWorkerCount?: number;
			idleShutdownTimeout?: number;
			initialiseMethod?: string;
			initialiseMethodParams?: () => Promise<unknown[]>;
			shutdownMethod?: string;
			shutdownMethodParams?: () => Promise<unknown[]>;
			executionTimeout?: number;
		}
	): Promise<void>;

	/**
	 * Unregister a handler for a task.
	 * @param taskType The type of the task handler to remove.
	 * @returns A promise that resolves when the handler is removed
	 */
	unregisterHandler(taskType: string): Promise<void>;

	/**
	 * Create a new task.
	 * @param taskType The type of the task.
	 * @param payload The payload for the task.
	 * @param options Additional options for the task.
	 * @param options.retryCount The number of times to retry the task if it fails, leave undefined to retry forever.
	 * @param options.retryInterval The interval in milliseconds to wait between retries, defaults to 5000, leave undefined for default scheduling.
	 * @param options.retainFor The amount of time in milliseconds to retain the result until removal, defaults to 0 for immediate removal, set to -1 to keep forever.
	 * @returns The id of the created task.
	 */
	create<T>(
		taskType: string,
		payload?: T,
		options?: {
			retryCount?: number;
			retryInterval?: number;
			retainFor?: number;
		}
	): Promise<string>;

	/**
	 * Get the task details.
	 * @param taskId The id of the task to get the details for.
	 * @returns The details of the task.
	 */
	get<T, U>(taskId: string): Promise<IBackgroundTask<T, U> | undefined>;

	/**
	 * Retry a failed task immediately instead of waiting for it's next scheduled retry time.
	 * @param taskId The id of the task to retry.
	 * @returns A promise that resolves when the retry request has been applied
	 */
	retry(taskId: string): Promise<void>;

	/**
	 * Remove a task ignoring any retain until date.
	 * @param taskId The id of the task to remove.
	 * @returns A promise that resolves when the task has been removed
	 */
	remove(taskId: string): Promise<void>;

	/**
	 * Cancel a task, will only be actioned if the task is currently pending.
	 * @param taskId The id of the task to cancel.
	 * @returns A promise that resolves when the cancellation has been applied
	 */
	cancel(taskId: string): Promise<void>;

	/**
	 * Query the list of tasks.
	 * @param taskType The type of the task to get.
	 * @param taskStatus The status of the task to get.
	 * @param sortProperty The property to sort by, defaults to dateCreated.
	 * @param sortDirection The order to sort by, defaults to ascending.
	 * @param cursor The cursor to get the next page of tasks.
	 * @param limit Limit the number of entities to return.
	 * @returns The list of tasks.
	 */
	query(
		taskType?: string,
		taskStatus?: TaskStatus,
		sortProperty?: "dateCreated" | "dateModified" | "dateCompleted" | "status",
		sortDirection?: SortDirection,
		cursor?: string,
		limit?: number
	): Promise<{
		entities: IBackgroundTask[];
		cursor?: string;
	}>;
}
