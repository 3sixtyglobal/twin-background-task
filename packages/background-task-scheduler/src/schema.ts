// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { nameof } from "@3sixty/nameof";
import { ScheduledTask } from "./entities/scheduledTask.js";

/**
 * Initialize the schema for the scheduled task service entity storage.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<ScheduledTask>(), () =>
		EntitySchemaHelper.getSchema(ScheduledTask)
	);
}
