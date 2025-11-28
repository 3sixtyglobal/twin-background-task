// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBackgroundTaskServiceConfig } from "./IBackgroundTaskServiceConfig.js";

/**
 * Options for the background task service constructor.
 */
export interface IBackgroundTaskServiceConstructorOptions {
	/**
	 * The background task entity storage connector type.
	 * @default background-task
	 */
	backgroundTaskEntityStorageType?: string;

	/**
	 * The logging component type.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the service.
	 */
	config?: IBackgroundTaskServiceConfig;
}
