// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { nameof } from "@3sixty/nameof";
import { BackgroundTask } from "./entities/backgroundTask.js";

/**
 * Initialize the schema for the background task service entity storage.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<BackgroundTask>(), () =>
		EntitySchemaHelper.getSchema(BackgroundTask)
	);
}
