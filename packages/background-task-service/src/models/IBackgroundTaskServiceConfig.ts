// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/**
 * Interface for the background task service.
 */
export interface IBackgroundTaskServiceConfig {
	/**
	 * The default interval to leave between tasks in milliseconds, defaults to 100ms.
	 */
	taskInterval?: number;

	/**
	 * The default retry interval to leave between tasks in milliseconds, defaults to 5000ms.
	 */
	retryInterval?: number;

	/**
	 * The default cleanup interval for removing retained tasks, defaults to 120000ms.
	 */
	cleanupInterval?: number;

	/**
	 * The maximum number of workers to use for processing tasks, defaults to the number of CPU cores.
	 */
	maxSystemWorkerCount?: number;

	/**
	 * How long in milliseconds stop() waits for each handler's workers to finish their shutdownMethod
	 * before force-terminating them. Defaults to 5000.
	 */
	workerShutdownTimeout?: number;

	/**
	 * The maximum dispatches of an attempt before the task is failed as interrupted, defaults to 3,
	 * set to -1 for no limit. Only dispatches that ended without a result count, and the count is
	 * per process, so a restart resumes the task with a fresh budget.
	 */
	maxDispatchCount?: number;

	/**
	 * The url of the handler to use for health checks. If not provided, the default health check handler will be used.
	 */
	overrideHealthCheckHandler?: string;
}
