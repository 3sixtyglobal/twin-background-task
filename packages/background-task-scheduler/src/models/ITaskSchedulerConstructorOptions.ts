// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ITaskSchedulerConfig } from "./ITaskSchedulerConfig";

/**
 * Options for the task scheduler constructor.
 */
export interface ITaskSchedulerConstructorOptions {
	/**
	 * The logging component type.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the task scheduler.
	 */
	config?: ITaskSchedulerConfig;
}
