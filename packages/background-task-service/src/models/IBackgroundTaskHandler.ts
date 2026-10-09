// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBackgroundTask } from "@3sixty/background-task-models";
import type { IBackgroundTaskWorker } from "./IBackgroundTaskWorker.js";

/**
 * Interface for the background task service.
 */
export interface IBackgroundTaskHandler {
	/**
	 * The module where the task handler is implemented.
	 */
	module: string;

	/**
	 * The method within the module to execute for the task.
	 */
	processingMethod: string;

	/**
	 * Callback function to be called when the task state changes.
	 */
	stateChangeCallback?: (task: IBackgroundTask) => Promise<void>;

	/**
	 * The method to call to initialise the task handler.
	 */
	initialiseMethod?: string;

	/**
	 * Callback to provide additional parameters to spread when calling the initialiseMethod.
	 */
	initialiseMethodParams?: () => Promise<unknown[]>;

	/**
	 * The method to call to shutdown the task handler.
	 */
	shutdownMethod?: string;

	/**
	 * Callback to provide additional parameters to spread when calling the shutdownMethod.
	 */
	shutdownMethodParams?: () => Promise<unknown[]>;

	/**
	 * The maximum number of workers for this task handler.
	 */
	maxWorkerCount: number;

	/**
	 * Terminate the worker after it has been idle for the specified timeout in milliseconds, defaults to 60000.
	 */
	idleShutdownTimeout: number;

	/**
	 * Maximum time in milliseconds a task may run before it is marked as failed and the worker terminated. Undefined means no limit.
	 */
	executionTimeout?: number;

	/**
	 * The workers associated with this task handler.
	 */
	workers: IBackgroundTaskWorker[];

	/**
	 * The timer used to wait between task executions.
	 */
	waitTimerId?: ReturnType<typeof setTimeout>;

	/**
	 * Consecutive times the system worker cap has blocked this type since it last had a worker of
	 * its own running.
	 */
	capReachedCount?: number;

	/**
	 * When the maxSystemWorkerCountReached warning was last logged for this type.
	 */
	capReachedLastLoggedMs?: number;
}
