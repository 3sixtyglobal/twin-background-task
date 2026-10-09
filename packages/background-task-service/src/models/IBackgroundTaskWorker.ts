// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBackgroundTask } from "@3sixty/background-task-models";
import type { IModuleWorker } from "@3sixty/modules";

/**
 * Interface for the background task service.
 */
export interface IBackgroundTaskWorker {
	/**
	 * The unique identifier for this background task worker.
	 */
	workerId: string;

	/**
	 * The worker module associated with this background task worker.
	 */
	module?: IModuleWorker;

	/**
	 * The background task being processed by this worker.
	 */
	task?: IBackgroundTask;

	/**
	 * The timer ID for idle shutdown.
	 */
	idleTimerId?: ReturnType<typeof setTimeout>;

	/**
	 * The timer ID for execution timeout.
	 */
	executionTimerId?: ReturnType<typeof setTimeout>;

	/**
	 * The worker has been asked to run its shutdown method, so it should not be asked again.
	 */
	shuttingDown?: boolean;
}
