// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test method.
 * @param engineCloneData The engine clone data.
 * @param contextIds The context IDs.
 * @param payload The payload.
 * @returns The test result.
 */
export async function testMethod(engineCloneData, contextIds, payload) {
	if (payload.throw) {
		throw new Error('error');
	}
	payload.counter++;
	return payload;
}

/**
 * Test method using engine.
 * @param engineCloneData The engine clone data.
 * @param contextIds The context IDs.
 * @param payload The payload.
 * @returns The test result.
 */
export async function testMethodWithEngine(engineCloneData, contextIds, payload) {
	payload.counter++;
	payload.engineCloneData = engineCloneData;
	return payload;
}
