// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Interface for the task scheduler configuration.
 */
export interface ITaskSchedulerConfig {
	/**
	 * The interval between checks for running tasks, defaults to 1 minute since that is the resolution of the tasks.
	 * @default 60000
	 */
	intervalMs?: number;

	/**
	 * The time in milliseconds after which a task that is still marked as running is considered stalled and can be run again.
	 * @default 300000
	 */
	stalledTaskTimeoutMs?: number;
}
