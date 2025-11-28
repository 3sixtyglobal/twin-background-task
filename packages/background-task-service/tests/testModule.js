// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
const { threadId } = await import('node:worker_threads');
const { ContextIdStore } = await import('@twin.org/context');

let moduleCounter = 0;

/**
 * Test method.
 * @param engineCloneData The engine clone data.
 * @param payload The payload.
 * @returns The test result.
 */
export async function testMethod(engineCloneData, payload) {
	if (payload.throw) {
		throw new Error('error');
	}
	payload.counter++;
	return payload;
}

/**
 * Test method using engine.
 * @param engineCloneData The engine clone data.
 * @param payload The payload.
 * @returns The test result.
 */
export async function testMethodWithEngine(engineCloneData, payload) {
	payload.counter++;
	payload.engineCloneData = engineCloneData;
	return payload;
}

/**
 * Test initialise method using engine.
 * @param engineCloneData The engine clone data.
 * @returns The initialise result.
 */
export async function testMethodInitialise(engineCloneData) {
	return 1;
}

/**
 * Test closedown method using engine.
 * @returns The closedown result.
 */
export async function testMethodShutdown() {
	return 2;
}

/**
 * Test method for threading.
 * @returns The thread id.
 */
export async function testMethodThreading() {
	return threadId;
}

/**
 * Test method for threading.
 * @returns The thread id.
 */
export async function testMethodThreadingSleep() {
	await new Promise(resolve => setTimeout(resolve, 100));
	return threadId;
}

/**
 * Test method for non idle terminate.
 * @returns The module counter.
 */
export async function testMethodNonIdleTerminate() {
	moduleCounter++;
	return moduleCounter;
}

/**
 * Test method for context ids.
 * @returns The context ids.
 */
export async function testMethodContextIds() {
	const contextIds = await ContextIdStore.getContextIds();
	return contextIds;
}
