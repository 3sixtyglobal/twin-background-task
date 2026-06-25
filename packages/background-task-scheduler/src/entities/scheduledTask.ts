// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";

/**
 * Class defining a scheduled task.
 */
@entity()
export class ScheduledTask {
	/**
	 * The id.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The last run time of the task, if undefined waiting for next run.
	 */
	@property({ type: "integer", optional: true, format: "uint64" })
	public lastRunTime?: number;
}
