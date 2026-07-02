// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBackgroundTask } from "@twin.org/background-task-models";
import type { IModuleWorker } from "@twin.org/modules";

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
}
