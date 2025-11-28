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
}
