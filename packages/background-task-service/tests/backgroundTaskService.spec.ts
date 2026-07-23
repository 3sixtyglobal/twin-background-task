// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import os from "node:os";
import path from "node:path";
import type { IBackgroundTask } from "@twin.org/background-task-models";
import { TaskStatus } from "@twin.org/background-task-models";
import { ContextIdKeys, ContextIdStore, type IContextIds } from "@twin.org/context";
import { Converter, Is, RandomHelper } from "@twin.org/core";
import { EngineCoreFactory, type IEngineCore } from "@twin.org/engine-models";
import {
	EntitySchemaFactory,
	EntitySchemaHelper,
	SortDirection,
	entity,
	property
} from "@twin.org/entity";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { ModuleHelper } from "@twin.org/modules";
import { nameof } from "@twin.org/nameof";
import { BackgroundTaskService } from "../src/backgroundTaskService.js";
import type { BackgroundTask } from "../src/entities/backgroundTask.js";
import { initSchema } from "../src/schema.js";

let backgroundTaskEntityStorageConnector: MemoryEntityStorageConnector<BackgroundTask>;
let partitionedRecordStorage: MemoryEntityStorageConnector<PartitionedRecord>;
let activeServices: BackgroundTaskService[] = [];

@entity()
class PartitionedRecord {
	@property({ type: "string", isPrimary: true })
	public id!: string;

	@property({ type: "string" })
	public value!: string;
}

interface ICallbackObservation {
	contextIds?: IContextIds;
	recordFound: boolean;
	taskStatus?: string;
}

interface ICallbackObservationHolder {
	current?: ICallbackObservation;
}

/**
 * Wait for status.
 * @param status The status to wait for.
 * @param itemIndex The item index to wait for.
 */
async function waitForStatus(status: string, itemIndex: number = 0): Promise<void> {
	const additionalItems = itemIndex * 2;
	for (let i = 0; i < 50 + additionalItems; i++) {
		if ((await backgroundTaskEntityStorageConnector.getStore())[itemIndex]?.status === status) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	console.debug(
		JSON.stringify((await backgroundTaskEntityStorageConnector.getStore())[itemIndex], null, 2)
	);
	throw new Error("Timeout waiting for status");
}

/**
 * Wait for error.
 * @param itemIndex The item index to wait for.
 */
async function waitForError(itemIndex: number = 0): Promise<void> {
	for (let i = 0; i < 500; i++) {
		if ((await backgroundTaskEntityStorageConnector.getStore())[itemIndex]?.error) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	throw new Error("Timeout waiting for error");
}

/**
 * Wait for the state-change callback observation to be recorded.
 * @param observationHolder The mutable observation holder.
 */
async function waitForCallbackObservation(
	observationHolder: ICallbackObservationHolder
): Promise<void> {
	for (let i = 0; i < 50; i++) {
		if (!Is.empty(observationHolder.current)) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	throw new Error("Timeout waiting for state-change callback");
}

interface ISpyCallCounter {
	mock: { calls: unknown[] };
}

/**
 * Wait for a spy to be called the expected number of times.
 * @param spyCallCounter The spy to wait for.
 * @param callCount The expected call count.
 */
async function waitForSpyCallCount(
	spyCallCounter: ISpyCallCounter,
	callCount: number
): Promise<void> {
	for (let i = 0; i < 50; i++) {
		if (spyCallCounter.mock.calls.length >= callCount) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	throw new Error(
		`Timeout waiting for spy calls: expected ${callCount}, got ${spyCallCounter.mock.calls.length}`
	);
}

function makeService(
	options?: ConstructorParameters<typeof BackgroundTaskService>[0]
): BackgroundTaskService {
	const service = new BackgroundTaskService(options);
	activeServices.push(service);
	return service;
}

describe("BackgroundTaskService", () => {
	beforeAll(() => {
		initSchema();

		const mockRandom = vi.fn();

		let i = 0;
		mockRandom.mockImplementation(() => Converter.bytesToHex(new Uint8Array(16).fill(i++)));

		RandomHelper.generateUuidV7 = mockRandom;
	});

	beforeEach(() => {
		backgroundTaskEntityStorageConnector = new MemoryEntityStorageConnector<BackgroundTask>({
			entitySchema: nameof<BackgroundTask>(),
			config: { storageKey: "background-task" }
		});

		EntityStorageConnectorFactory.register(
			"background-task",
			() => backgroundTaskEntityStorageConnector
		);
	});

	afterEach(async () => {
		await Promise.all(activeServices.map(async s => s.stop().catch(() => {})));
		activeServices = [];
		await backgroundTaskEntityStorageConnector.teardown();
		await partitionedRecordStorage?.teardown();
	});

	test("can construct with dependencies", async () => {
		const backgroundTaskService = makeService();

		expect(backgroundTaskService).toBeDefined();
	});

	test("can create a task with no handler", async () => {
		const backgroundTaskService = makeService();

		await backgroundTaskService.start();
		const taskId = await backgroundTaskService.create("my-type");
		expect(taskId.split(":")[0]).toEqual("background-task");
		expect(taskId.split(":")[1]).toEqual("entity-storage");

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				id: "00000000000000000000000000000000",
				retainFor: 0,
				status: "pending",
				type: "my-type"
			}
		]);
	});

	test("can create a task with handler and no retainment", async () => {
		const backgroundTaskService = makeService();

		await backgroundTaskService.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskService.start();
		await backgroundTaskService.create("my-type", { counter: 0 });

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				id: "01010101010101010101010101010101",
				payload: {
					counter: 0
				},
				retainFor: 0,
				status: "pending",
				threadId: "main",
				type: "my-type"
			}
		]);
	});

	test("can create a task with handler and retainment", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskConnector.start();
		await backgroundTaskConnector.create("my-type", { counter: 0 }, { retainFor: 10000 });

		await waitForStatus("success");

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				id: "02020202020202020202020202020202",
				payload: {
					counter: 0
				},
				result: {
					counter: 1
				},
				status: "success",
				type: "my-type"
			}
		]);
	});

	test("can create a task with handler and retainment with error and no retries", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskConnector.start();
		await backgroundTaskConnector.create(
			"my-type",
			{ throw: true, counter: 0 },
			{ retainFor: 10000 }
		);

		await waitForStatus("failed");

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				type: "my-type",
				status: "failed",
				payload: {
					counter: 0,
					throw: true
				},
				error: {
					name: "Error",
					message: "error"
				}
			}
		]);
	});

	test("can create a task with handler and retainment with error and single retry", async () => {
		const backgroundTaskConnector = makeService();

		const data = {
			throw: true,
			counter: 0
		};
		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskConnector.start();
		await backgroundTaskConnector.create("my-type", data, {
			retainFor: 10000,
			retryCount: 1,
			retryInterval: 2000
		});

		await waitForError();

		let store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				type: "my-type",
				retryInterval: 2000,
				status: "pending",
				payload: {
					counter: 0,
					throw: true
				},
				error: {
					name: "Error",
					message: "error"
				}
			}
		]);

		if (store[0]?.payload) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(store[0].payload as any).throw = false;
			await backgroundTaskEntityStorageConnector.set(store[0]);
		}

		const taskUrn = `background-task:entity-storage:${store[0].id}`;
		const task = await backgroundTaskConnector.get(taskUrn);
		expect(task).toBeDefined();
		expect(task?.id).toEqual(taskUrn);

		await waitForStatus("success");

		store = await backgroundTaskEntityStorageConnector.getStore();

		expect(store).toMatchObject([
			{
				type: "my-type",
				status: "success",
				payload: {
					counter: 0,
					throw: false
				},
				result: {
					counter: 1,
					throw: false
				}
			}
		]);
	});

	test("can add multiple tasks and process them in order", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskConnector.start();

		for (let i = 0; i < 5; i++) {
			await backgroundTaskConnector.create("my-type", { id: i, counter: i }, { retainFor: 10000 });
		}

		await waitForStatus("success", 4);

		const store = await backgroundTaskEntityStorageConnector.getStore();

		expect(store).toMatchObject([
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 0,
					counter: 0
				},
				result: {
					id: 0,
					counter: 1
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 1,
					counter: 1
				},
				result: {
					id: 1,
					counter: 2
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 2,
					counter: 2
				},
				result: {
					id: 2,
					counter: 3
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 3,
					counter: 3
				},
				result: {
					id: 3,
					counter: 4
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 4,
					counter: 4
				},
				result: {
					id: 4,
					counter: 5
				}
			}
		]);
	});

	test("can add multiple tasks and process them in order, when one item fails and no retry", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskConnector.start();
		for (let i = 0; i < 5; i++) {
			await backgroundTaskConnector.create(
				"my-type",
				{ id: i, counter: i, throw: i === 2 },
				{ retainFor: 10000 }
			);
		}

		await waitForStatus("success", 4);

		const store = await backgroundTaskEntityStorageConnector.getStore();

		expect(store).toMatchObject([
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 0,
					counter: 0
				},
				result: {
					id: 0,
					counter: 1
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 1,
					counter: 1
				},
				result: {
					id: 1,
					counter: 2
				}
			},
			{
				type: "my-type",
				status: "failed",
				payload: {
					id: 2,
					counter: 2
				},
				error: {
					name: "Error",
					message: "error"
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 3,
					counter: 3
				},
				result: {
					id: 3,
					counter: 4
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 4,
					counter: 4
				},
				result: {
					id: 4,
					counter: 5
				}
			}
		]);
	});

	test("can add multiple tasks and process them in order, when one item fails and retry", async () => {
		const backgroundTaskConnector = makeService({
			config: { taskInterval: 500 }
		});

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod"
		);

		await backgroundTaskConnector.start();
		for (let i = 0; i < 5; i++) {
			await backgroundTaskConnector.create(
				"my-type",
				{ id: i, counter: 0, throw: i === 2 },
				{ retainFor: 10000, retryCount: 1, retryInterval: 3000 }
			);
		}

		await waitForError(2);
		const store2 = await backgroundTaskEntityStorageConnector.getStore();
		if (store2[2]?.payload) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(store2[2].payload as any).throw = false;
			await backgroundTaskEntityStorageConnector.set(store2[2]);
		}
		await waitForStatus("success", 2);

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 0,
					counter: 0
				},
				result: {
					id: 0,
					counter: 1
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 1,
					counter: 0
				},
				result: {
					id: 1,
					counter: 1
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 2,
					counter: 0
				},
				result: {
					id: 2,
					counter: 1
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 3,
					counter: 0
				},
				result: {
					id: 3,
					counter: 1
				}
			},
			{
				type: "my-type",
				status: "success",
				payload: {
					id: 4,
					counter: 0
				},
				result: {
					id: 4,
					counter: 1
				}
			}
		]);

		const completedOrder = await backgroundTaskConnector.query(
			"my-type",
			"success",
			"dateCompleted",
			SortDirection.Ascending
		);
		expect(completedOrder.entities.length).toBe(5);
		expect(completedOrder.entities[0].payload?.id).toBe(0);
		expect(completedOrder.entities[1].payload?.id).toBe(1);
		expect(completedOrder.entities[2].payload?.id).toBe(3);
		expect(completedOrder.entities[3].payload?.id).toBe(4);
		expect(completedOrder.entities[4].payload?.id).toBe(2);
		for (const ent of completedOrder.entities) {
			expect(ent.id).toMatch(/^background-task:entity-storage:/);
		}
	});

	test("can create a task and cancel it", async () => {
		const backgroundTaskConnector = makeService({
			config: { taskInterval: 1000 }
		});

		await backgroundTaskConnector.start();
		const id = await backgroundTaskConnector.create(
			"my-type",
			{ counter: 0 },
			{ retryCount: 10, retryInterval: 10000, retainFor: 10000 }
		);

		await backgroundTaskConnector.cancel(id);

		const store = await backgroundTaskEntityStorageConnector.getStore();

		expect(store[0].status).toEqual("cancelled");
		expect(store[0].dateCancelled).toBeDefined();
	});

	test("get() and state-change callback both return task id in URN form", async () => {
		const backgroundTaskService = makeService();
		let callbackTaskId: string | undefined;

		await backgroundTaskService.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod",
			async (task: IBackgroundTask) => {
				if (task.status === TaskStatus.Success) {
					callbackTaskId = task.id;
				}
			},
			{ idleShutdownTimeout: -1 }
		);

		await backgroundTaskService.start();
		const taskId = await backgroundTaskService.create(
			"my-type",
			{ counter: 0 },
			{ retainFor: 10000 }
		);

		await waitForStatus("success");
		await new Promise(resolve => setTimeout(resolve, 100));

		const task = await backgroundTaskService.get(taskId);
		expect(task?.id).toEqual(taskId);
		expect(callbackTaskId).toEqual(taskId);
	});

	test("can cleanup retained items when passed their retained date", async () => {
		const backgroundTaskConnector = makeService({
			config: { taskInterval: 1000 }
		});

		const now = Date.now();
		await backgroundTaskEntityStorageConnector.set({
			id: "00000000000000000000000000000000",
			type: "my-type",
			threadId: "main",
			dateCreated: new Date(now - 1000).toISOString(),
			dateModified: new Date(now - 1000).toISOString(),
			retryInterval: 10000,
			retainFor: 10000,
			status: "success",
			retriesRemaining: 9,
			payload: {
				counter: 0
			},
			retainUntil: now - 100
		});

		await backgroundTaskConnector.start();

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store.length).toEqual(0);
	});

	test("can not cleanup retained items when their retained date has not yet passed", async () => {
		const backgroundTaskConnector = makeService({
			config: { taskInterval: 1000 }
		});

		const now = Date.now();
		await backgroundTaskEntityStorageConnector.set({
			id: "00000000000000000000000000000000",
			type: "my-type",
			threadId: "main",
			dateCreated: new Date(now).toISOString(),
			dateModified: new Date(now).toISOString(),
			retryInterval: 10000,
			retainFor: 10000,
			status: "success",
			retriesRemaining: 9,
			payload: {
				counter: 0
			},
			retainUntil: now + 5000
		});

		await backgroundTaskConnector.start();

		await new Promise(resolve => setTimeout(resolve, 1000));

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store.length).toEqual(1);
	});

	test("can not cleanup retained items when no retained date set", async () => {
		const backgroundTaskConnector = makeService({
			config: { taskInterval: 1000 }
		});

		const now = Date.now();
		await backgroundTaskEntityStorageConnector.set({
			id: "00000000000000000000000000000000",
			type: "my-type",
			threadId: "main",
			dateCreated: new Date(now).toISOString(),
			dateModified: new Date(now).toISOString(),
			retryInterval: 10000,
			retainFor: 10000,
			status: "success",
			retriesRemaining: 9,
			payload: {
				counter: 0
			}
		});

		await backgroundTaskConnector.start();

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store.length).toEqual(1);
	});

	test("can start a clone of the engine in the background task", async () => {
		const backgroundTaskConnector = makeService({
			config: { taskInterval: 1000 }
		});

		EngineCoreFactory.register(
			"engine",
			() => ({ getCloneData: () => ({ foo: "bar" }) }) as unknown as IEngineCore
		);

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodWithEngine"
		);

		await backgroundTaskConnector.create("my-type", { counter: 1 }, { retainFor: 10000 });
		await backgroundTaskConnector.start();

		await waitForStatus("success");

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store).toMatchObject([
			{
				payload: {
					counter: 1
				},
				result: {
					counter: 2,
					engineCloneData: { foo: "bar" }
				},
				status: "success",
				type: "my-type"
			}
		]);
	});

	test("can add task to a handler with init and shutdown methods", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod",
			undefined,
			{
				initialiseMethod: "testMethodInitialise",
				shutdownMethod: "testMethodShutdown"
			}
		);

		await backgroundTaskConnector.start();

		await backgroundTaskConnector.create("my-type", { counter: 1 }, { retainFor: 10000 });

		await waitForStatus("success", 0);
	});

	test("can add task to a handler with multiple threads", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodThreading",
			undefined,
			{
				maxWorkerCount: 5
			}
		);

		await backgroundTaskConnector.start();

		for (let i = 0; i < 5; i++) {
			await backgroundTaskConnector.create("my-type", { counter: i }, { retainFor: 10000 });
		}

		await waitForStatus("success", 4);

		const store = await backgroundTaskEntityStorageConnector.getStore();

		const workerThreadIds = new Set();
		for (const item of store) {
			workerThreadIds.add(item.result);
		}
		expect(Array.from(workerThreadIds).length).toEqual(5);
	});

	test("can add task to a handler with no termination on idle", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodNonIdleTerminate",
			undefined,
			{
				idleShutdownTimeout: -1
			}
		);

		await backgroundTaskConnector.start();

		for (let i = 0; i < 5; i++) {
			await backgroundTaskConnector.create("my-type", { counter: i }, { retainFor: 10000 });
		}

		await waitForStatus("success", 4);

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store[4].result).toEqual(5);
	});

	test("does not dispatch the same task twice when two processing cycles overlap on the first activity (#177)", async () => {
		const backgroundTaskConnector = makeService();

		// The state-change callback runs on the main thread, so it observes every
		// transition. Counting Success transitions detects a duplicate dispatch even when
		// the duplicate runs on a second worker thread (where a module-level counter would
		// not be shared).
		let successCount = 0;

		await backgroundTaskConnector.start();

		// Reproduce the reporter's first-activity ordering: create() schedules a
		// processTaskType run (via setTimeout), then registerHandler() triggers one
		// immediately. Both target the same pending task; a slow worker method keeps it
		// in-progress so the scheduled run overlaps the just-dispatched one, and
		// maxWorkerCount > 1 lets a second worker be created. Before the fix this
		// dispatched the task twice.
		await backgroundTaskConnector.create("race-type", { counter: 0 }, { retainFor: 10000 });
		await backgroundTaskConnector.registerHandler(
			"race-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodSlow",
			async task => {
				if (task.status === "success") {
					successCount++;
				}
			},
			{
				maxWorkerCount: 2,
				idleShutdownTimeout: -1
			}
		);

		await waitForStatus("success", 0);
		// Settle: allow any erroneous second dispatch (scheduled ~100ms after create) to
		// run to completion before asserting.
		await new Promise(resolve => setTimeout(resolve, 500));

		// The task must have completed exactly once, and there must be a single task row.
		expect(successCount).toEqual(1);
		expect((await backgroundTaskEntityStorageConnector.getStore()).length).toEqual(1);
	});

	test("releases in-flight claim on dispatch error so the task can be retried", async () => {
		// Regression for Bug 1: workerProcessTasks can throw (e.g. storage failure)
		// between _inFlightTaskIds.add and the worker actually starting. Without a
		// try/finally the claim is never released and the task is permanently skipped.
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"retry-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod",
			undefined,
			{ maxWorkerCount: 2, idleShutdownTimeout: -1 }
		);
		await backgroundTaskConnector.start();

		// Create the task first so the storage write from create() completes before
		// the spy is installed — any subsequent set() call comes from workerProcessTasks.
		await backgroundTaskConnector.create("retry-type", { counter: 0 }, { retainFor: 10000 });

		// Throw exactly once on the next set() call (the "set status to Processing"
		// write). Without Fix 1 the task ID leaks into _inFlightTaskIds permanently.
		vi.spyOn(backgroundTaskEntityStorageConnector, "set").mockImplementationOnce(async () => {
			throw new Error("transient storage error");
		});

		// Let the 100ms dispatch timer fire and the single-throw spy be consumed.
		await new Promise(resolve => setTimeout(resolve, 200));

		// Trigger a fresh processTaskType cycle; with Fix 1 the in-flight claim was
		// released in the finally block so the task is picked up and succeeds.
		await backgroundTaskConnector.create("retry-type", { counter: 0 }, { retainFor: 10000 });

		await waitForStatus("success", 0);
		await waitForStatus("success", 1);

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store[0].status).toEqual("success");
		expect(store[1].status).toEqual("success");

		vi.restoreAllMocks();
	});

	test("per-type in-flight tracking does not inflate the candidate query for unrelated task types", async () => {
		// Regression for Bug 3: getNextTask used _inFlightTaskIds.size (global count)
		// as the query limit, so in-flight tasks of type A inflated the fetch for
		// type B. With Fix 3 the limit is per-type, so each query fetches exactly
		// (in-flight-for-type + 1) candidates regardless of other types.
		const backgroundTaskConnector = makeService();

		// Slow type — blocks workers so _inFlightTaskIds grows for "slow-type".
		await backgroundTaskConnector.registerHandler(
			"slow-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodSlow",
			undefined,
			{ maxWorkerCount: 3, idleShutdownTimeout: -1 }
		);
		// Fast type — must be dispatched promptly regardless of slow-type in-flight count.
		await backgroundTaskConnector.registerHandler(
			"fast-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod",
			undefined,
			{ idleShutdownTimeout: -1 }
		);

		await backgroundTaskConnector.start();

		// Fill the slow-type in-flight set with 3 concurrent entries.
		await backgroundTaskConnector.create("slow-type", {}, { retainFor: 10000 });
		await backgroundTaskConnector.create("slow-type", {}, { retainFor: 10000 });
		await backgroundTaskConnector.create("slow-type", {}, { retainFor: 10000 });

		// Allow time for slow tasks to be dispatched and added to _inFlightTaskIds.
		await new Promise(resolve => setTimeout(resolve, 200));

		// Create the fast task; the fast-type in-flight set is empty so the query
		// limit should be 1 (not 4 as the old global-size code would produce).
		// Either way the task must be dispatched and succeed.
		await backgroundTaskConnector.create("fast-type", { counter: 0 }, { retainFor: 10000 });

		// Fast task is store index 3 (three slow tasks were created first).
		await waitForStatus("success", 3);
		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store[3].status).toEqual("success");
	});

	test("can propogate context ids to background task", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodContextIds",
			undefined,
			{
				idleShutdownTimeout: -1
			}
		);

		await backgroundTaskConnector.start();

		await ContextIdStore.run({ testContextId: "12345" }, async () => {
			await backgroundTaskConnector.create("my-type", { counter: 0 }, { retainFor: 10000 });
		});

		await waitForStatus("success", 0);

		const store = await backgroundTaskEntityStorageConnector.getStore();
		expect(store[0].result).toEqual({ testContextId: "12345" });
	});

	test("can handle multiple tasks at the same time", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type-1",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodThreading"
		);
		await backgroundTaskConnector.registerHandler(
			"my-type-2",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodThreading"
		);

		await backgroundTaskConnector.start();

		await backgroundTaskConnector.create("my-type-1", { counter: 0 }, { retainFor: 10000 });
		await backgroundTaskConnector.create("my-type-2", { counter: 0 }, { retainFor: 10000 });

		await waitForStatus("success", 1);

		const store = await backgroundTaskEntityStorageConnector.getStore();
		const workerThreadIds = new Set();
		for (const item of store) {
			workerThreadIds.add(item.result);
		}
		expect(Array.from(workerThreadIds).length).toEqual(2);
	});

	test("can use the maximum number of threads", async () => {
		const backgroundTaskConnector = makeService();

		await backgroundTaskConnector.registerHandler(
			"my-type",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethodThreadingSleep",
			undefined,
			{
				maxWorkerCount: -1,
				idleShutdownTimeout: -1
			}
		);

		await backgroundTaskConnector.start();

		const systemWorkerCount = os.cpus().length;
		const numberItems = systemWorkerCount * 2;

		for (let i = 0; i < numberItems; i++) {
			await backgroundTaskConnector.create(
				"my-type",
				{ counter: i },
				{ retainFor: numberItems * 1000 }
			);
		}

		await waitForStatus("success", numberItems - 1);

		const store = await backgroundTaskEntityStorageConnector.getStore();
		const workerThreadIds = new Set();
		for (const item of store) {
			workerThreadIds.add(item.result);
		}

		expect(Array.from(workerThreadIds).length).toBeGreaterThan(0);
		expect(Array.from(workerThreadIds).length).toBeLessThanOrEqual(systemWorkerCount);
	});

	test("releases worker and reschedules once when task finalisation throws", async () => {
		const backgroundTaskService = makeService();
		const serviceInternals = backgroundTaskService as unknown as {
			_workers: { [workerId: string]: { worker: { task?: unknown } } };
			scheduleNextTaskProcessing(taskType: string): void;
		};

		await backgroundTaskService.registerHandler(
			"finalisation-failure",
			`file://${path.join(__dirname, "testModule.js")}`,
			"testMethod",
			undefined,
			{ idleShutdownTimeout: -1 }
		);

		await backgroundTaskService.start();

		const scheduleSpy = vi.spyOn(serviceInternals, "scheduleNextTaskProcessing");
		const originalSet = backgroundTaskEntityStorageConnector.set.bind(
			backgroundTaskEntityStorageConnector
		);
		const setSpy = vi
			.spyOn(backgroundTaskEntityStorageConnector, "set")
			.mockImplementation(async (taskEntity: BackgroundTask) => {
				if (taskEntity.status === TaskStatus.Success) {
					throw new Error("finalisation storage failed");
				}
				return originalSet(taskEntity);
			});

		await backgroundTaskService.create(
			"finalisation-failure",
			{ counter: 0 },
			{ retainFor: 10_000 }
		);

		await waitForSpyCallCount(scheduleSpy, 1);
		expect(scheduleSpy).toHaveBeenCalledWith("finalisation-failure");

		for (const workerEntry of Object.values(serviceInternals._workers)) {
			expect(workerEntry.worker.task).toBeUndefined();
		}

		setSpy.mockRestore();
		scheduleSpy.mockClear();

		await backgroundTaskService.create(
			"finalisation-failure",
			{ counter: 1 },
			{ retainFor: 10_000 }
		);

		await waitForStatus(TaskStatus.Success, 1);
		await waitForSpyCallCount(scheduleSpy, 1);

		scheduleSpy.mockRestore();
	});

	describe("state-change callback context", () => {
		const TENANT_A = "tenant-org-a";
		const TENANT_B = "tenant-org-b";
		const RECORD_ID = "record-under-tenant-a";

		beforeAll(() => {
			EntitySchemaFactory.register(nameof<PartitionedRecord>(), () =>
				EntitySchemaHelper.getSchema(PartitionedRecord)
			);
		});

		beforeEach(() => {
			partitionedRecordStorage = new MemoryEntityStorageConnector<PartitionedRecord>({
				entitySchema: nameof<PartitionedRecord>(),
				partitionContextIds: [ContextIdKeys.Tenant],
				config: { storageKey: "partitioned-record" }
			});
		});

		afterEach(async () => {
			const contextStorage = await ContextIdStore.getStorage();
			contextStorage.enterWith({});
			await partitionedRecordStorage.teardown();
		});

		test("task entity stores creation tenant contextIds", async () => {
			const backgroundTaskService = makeService();

			await backgroundTaskService.start();

			await ContextIdStore.run({ [ContextIdKeys.Tenant]: TENANT_A }, async () => {
				await backgroundTaskService.create("context-capture", { recordId: RECORD_ID });
			});

			const storedTask = (await backgroundTaskEntityStorageConnector.getStore())[0];
			expect(storedTask.contextIds).toEqual({ [ContextIdKeys.Tenant]: TENANT_A });
		});

		test("state-change callback reads context-partitioned storage under task tenant", async () => {
			const backgroundTaskService = makeService();
			const observation: ICallbackObservationHolder = {};

			await backgroundTaskService.registerHandler<{ recordId: string }, { ok: boolean }>(
				"partitioned-finalise",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethod",
				async (task: IBackgroundTask<{ recordId: string }, { ok: boolean }>) => {
					if (task.status !== TaskStatus.Success) {
						return;
					}

					const contextIds = await ContextIdStore.getContextIds();
					const record = await partitionedRecordStorage.get(task.payload?.recordId ?? "");
					observation.current = {
						contextIds,
						recordFound: Is.object(record),
						taskStatus: task.status
					};
				},
				{ idleShutdownTimeout: -1 }
			);

			await backgroundTaskService.start();

			await ContextIdStore.run({ [ContextIdKeys.Tenant]: TENANT_A }, async () => {
				await partitionedRecordStorage.set({
					id: RECORD_ID,
					value: "created-under-tenant-a"
				});
				await backgroundTaskService.create(
					"partitioned-finalise",
					{ recordId: RECORD_ID },
					{ retainFor: 10_000 }
				);
			});

			// Simulate a concurrent main-thread request for tenant B while the worker completes.
			const contextStorage = await ContextIdStore.getStorage();
			contextStorage.enterWith({ [ContextIdKeys.Tenant]: TENANT_B });

			await waitForStatus(TaskStatus.Success);
			await waitForCallbackObservation(observation);

			const storedTask = (await backgroundTaskEntityStorageConnector.getStore())[0];
			expect(storedTask.contextIds).toEqual({ [ContextIdKeys.Tenant]: TENANT_A });
			expect(observation.current?.taskStatus).toEqual(TaskStatus.Success);
			expect(observation.current?.contextIds?.[ContextIdKeys.Tenant]).toEqual(TENANT_A);
			expect(observation.current?.recordFound).toBe(true);
		});

		test("state-change callback errors are caught and not unhandled rejections", async () => {
			const backgroundTaskService = makeService();

			const unhandledRejections: unknown[] = [];
			const onUnhandledRejection = (reason: unknown): void => {
				unhandledRejections.push(reason);
			};
			process.on("unhandledRejection", onUnhandledRejection);

			try {
				await backgroundTaskService.registerHandler(
					"throwing-callback",
					`file://${path.join(__dirname, "testModule.js")}`,
					"testMethod",
					async (task: IBackgroundTask) => {
						if (task.status === TaskStatus.Success) {
							throw new Error("state-change callback failed");
						}
					},
					{ idleShutdownTimeout: -1 }
				);

				await backgroundTaskService.start();
				await backgroundTaskService.create(
					"throwing-callback",
					{ counter: 0 },
					{ retainFor: 10_000 }
				);

				await waitForStatus(TaskStatus.Success);
				await new Promise(resolve => setTimeout(resolve, 300));

				expect(unhandledRejections).toHaveLength(0);
			} finally {
				process.off("unhandledRejection", onUnhandledRejection);
			}
		});
	});

	describe("worker thread lifecycle", () => {
		test("terminates worker thread after task completes with idleShutdownTimeout 0", async () => {
			const terminateSpy = vi.fn().mockResolvedValue(0);
			const originalFn = ModuleHelper.execModuleMethodThreadMessage.bind(ModuleHelper);

			vi.spyOn(ModuleHelper, "execModuleMethodThreadMessage").mockImplementation(
				(module, completed, options) => {
					const worker = originalFn(module, completed, options);
					const originalTerminate = worker.terminate.bind(worker);
					worker.terminate = vi.fn().mockImplementation(async () => {
						terminateSpy();
						return originalTerminate();
					});
					return worker;
				}
			);

			const backgroundTaskService = makeService();
			await backgroundTaskService.registerHandler(
				"terminate-type",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethod"
				// idleShutdownTimeout defaults to 0 — immediate cleanup after each task
			);
			await backgroundTaskService.start();
			await backgroundTaskService.create("terminate-type", { counter: 0 }, { retainFor: 10000 });

			await waitForStatus("success");

			// Bug 1: without the fix, cleanupWorker() never calls terminate()
			expect(terminateSpy).toHaveBeenCalledOnce();

			vi.restoreAllMocks();
			await backgroundTaskService.stop();
		});

		test("terminates worker threads when stop() is called", async () => {
			const terminateSpy = vi.fn().mockResolvedValue(0);
			const originalFn = ModuleHelper.execModuleMethodThreadMessage.bind(ModuleHelper);

			vi.spyOn(ModuleHelper, "execModuleMethodThreadMessage").mockImplementation(
				(module, completed, options) => {
					const worker = originalFn(module, completed, options);
					const originalTerminate = worker.terminate.bind(worker);
					worker.terminate = vi.fn().mockImplementation(async () => {
						terminateSpy();
						return originalTerminate();
					});
					return worker;
				}
			);

			const backgroundTaskService = makeService();
			await backgroundTaskService.registerHandler(
				"stop-type",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethod",
				undefined,
				{ idleShutdownTimeout: -1 } // keep alive — worker survives the task
			);
			await backgroundTaskService.start();
			await backgroundTaskService.create("stop-type", { counter: 0 }, { retainFor: 10000 });

			await waitForStatus("success");

			// Worker is still alive (idleShutdownTimeout: -1), terminate not yet called
			expect(terminateSpy).not.toHaveBeenCalled();

			// Bug 2: without the fix, stop() never calls terminate()
			await backgroundTaskService.stop();
			expect(terminateSpy).toHaveBeenCalledOnce();

			vi.restoreAllMocks();
		});

		test("stop() invokes shutdownMethod before terminating workers", async () => {
			let shutdownMethodCompleted = false;
			const terminateSpy = vi.fn().mockResolvedValue(0);
			const originalFn = ModuleHelper.execModuleMethodThreadMessage.bind(ModuleHelper);

			vi.spyOn(ModuleHelper, "execModuleMethodThreadMessage").mockImplementation(
				(module, completed, options) => {
					const wrappedCompleted = async (
						operation: string,
						result?: unknown,
						err?: Error
					): Promise<void> => {
						if (operation === "testMethodShutdown") {
							shutdownMethodCompleted = true;
						}
						return completed(operation, result, err);
					};
					const worker = originalFn(module, wrappedCompleted, options);
					const originalTerminate = worker.terminate.bind(worker);
					worker.terminate = vi.fn().mockImplementation(async () => {
						terminateSpy();
						return originalTerminate();
					});
					return worker;
				}
			);

			const backgroundTaskService = makeService();
			await backgroundTaskService.registerHandler(
				"graceful-stop-type",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethod",
				undefined,
				{
					idleShutdownTimeout: -1,
					shutdownMethod: "testMethodShutdown"
				}
			);
			await backgroundTaskService.start();
			await backgroundTaskService.create(
				"graceful-stop-type",
				{ counter: 0 },
				{ retainFor: 10000 }
			);

			await waitForStatus("success");

			// Worker is still alive (idleShutdownTimeout: -1); shutdownMethod not yet called
			expect(shutdownMethodCompleted).toBe(false);

			// stop() should call shutdownMethod before terminating — currently FAILS (red)
			await backgroundTaskService.stop();
			expect(shutdownMethodCompleted).toBe(true);
			expect(terminateSpy).toHaveBeenCalledOnce();

			vi.restoreAllMocks();
		});

		test("terminates workers and clears pool when handler is unregistered", async () => {
			const terminateSpy = vi.fn().mockResolvedValue(0);
			const originalFn = ModuleHelper.execModuleMethodThreadMessage.bind(ModuleHelper);

			vi.spyOn(ModuleHelper, "execModuleMethodThreadMessage").mockImplementation(
				(module, completed, options) => {
					const worker = originalFn(module, completed, options);
					const originalTerminate = worker.terminate.bind(worker);
					worker.terminate = vi.fn().mockImplementation(async () => {
						terminateSpy();
						return originalTerminate();
					});
					return worker;
				}
			);

			const backgroundTaskService = makeService();
			const serviceInternals = backgroundTaskService as unknown as {
				_workers: { [workerId: string]: unknown };
			};

			await backgroundTaskService.registerHandler(
				"unregister-type",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethod",
				undefined,
				{ idleShutdownTimeout: -1 } // keep alive — worker stays in pool after task
			);
			await backgroundTaskService.start();
			await backgroundTaskService.create("unregister-type", { counter: 0 }, { retainFor: 10000 });

			await waitForStatus("success");

			// Worker is alive and tracked in the pool
			expect(Object.keys(serviceInternals._workers)).toHaveLength(1);
			expect(terminateSpy).not.toHaveBeenCalled();

			// Bug 3: without the fix, unregisterHandler() never cleans up or terminates workers
			await backgroundTaskService.unregisterHandler("unregister-type");
			expect(terminateSpy).toHaveBeenCalledOnce();
			expect(Object.keys(serviceInternals._workers)).toHaveLength(0);

			vi.restoreAllMocks();
			await backgroundTaskService.stop();
		});

		test("removes crashed worker from pool and releases in-flight claim when worker thread crashes during task execution", async () => {
			const backgroundTaskService = makeService();
			const serviceInternals = backgroundTaskService as unknown as {
				_workers: { [workerId: string]: unknown };
				_inFlightTaskIds: Map<string, Set<string>>;
			};

			await backgroundTaskService.registerHandler(
				"crash-type",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethodCrash",
				undefined,
				{ idleShutdownTimeout: -1 }
			);

			await backgroundTaskService.start();
			await backgroundTaskService.create("crash-type", {}, { retainFor: 10000 });

			// Wait until the task error is written to storage — that proves
			// taskFinishedProcessing ran. Then give cleanupWorker a moment to follow.
			await waitForError();
			await new Promise(resolve => setTimeout(resolve, 50));

			// Bug 4: without the fix, the dead worker stays in _workers
			expect(Object.keys(serviceInternals._workers)).toHaveLength(0);

			// Bug 4: without the fix, the task in-flight claim is never released
			const inFlight = serviceInternals._inFlightTaskIds.get("crash-type");
			expect(inFlight?.size ?? 0).toEqual(0);

			await backgroundTaskService.stop();
		});
	});

	describe("orphaned task adoption", () => {
		test("adopts a pending task left by a worker thread from a previous session", async () => {
			// Simulate a task created by worker thread "2" in a previous session that
			// never completed before the pod restarted.
			const orphanedTask: BackgroundTask = {
				id: "bb000000000000000000000000000000",
				type: "my-type",
				threadId: "2",
				status: TaskStatus.Pending,
				payload: { counter: 5 },
				retainFor: 10_000,
				dateCreated: new Date(Date.now()).toISOString(),
				dateModified: new Date(Date.now()).toISOString(),
				dateNextProcess: new Date(Date.now()).toISOString()
			};
			await backgroundTaskEntityStorageConnector.set(orphanedTask);

			const backgroundTaskService = makeService();

			await backgroundTaskService.registerHandler(
				"my-type",
				`file://${path.join(__dirname, "testModule.js")}`,
				"testMethod"
			);

			// start() → adoptOrphanedTasks() resets threadId "2" → "main",
			// then processTaskType() picks it up and executes it.
			await backgroundTaskService.start();

			await waitForStatus(TaskStatus.Success);

			const store = await backgroundTaskEntityStorageConnector.getStore();
			expect(store[0].threadId).toEqual("main");
			expect(store[0].status).toEqual(TaskStatus.Success);
			expect(store[0].result).toMatchObject({ counter: 6 });
		});
	});
});
