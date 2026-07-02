// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBackgroundTask } from "@twin.org/background-task-models";
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
	 * The method to call to shutdown the task handler.
	 */
	shutdownMethod?: string;

	/**
	 * The maximum number of workers for this task handler.
	 */
	maxWorkerCount: number;

	/**
	 * Terminate the worker after it has been idle for the specified timeout in milliseconds, defaults to 60000.
	 */
	idleShutdownTimeout: number;

	/**
	 * The workers associated with this task handler.
	 */
	workers: IBackgroundTaskWorker[];

	/**
	 * The timer used to wait between task executions.
	 */
	waitTimerId?: ReturnType<typeof setTimeout>;
}
