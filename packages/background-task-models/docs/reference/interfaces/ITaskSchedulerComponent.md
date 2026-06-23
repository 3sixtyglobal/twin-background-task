# Interface: ITaskSchedulerComponent

Interface describing a task scheduler.

## Extends

- `IComponent`

## Methods

### addTask() {#addtask}

> **addTask**(`taskId`, `times`, `taskCallback`): `Promise`\<`void`\>

Add a task to the scheduler.

#### Parameters

##### taskId

`string`

The id of the task to add.

##### times

[`IScheduledTaskTime`](IScheduledTaskTime.md)[]

The times at which the task should be scheduled.

##### taskCallback

() => `Promise`\<`void`\>

The callback to execute when the task is scheduled.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the task is registered with the scheduler

***

### removeTask() {#removetask}

> **removeTask**(`taskId`): `Promise`\<`void`\>

Remove a task from the scheduler.

#### Parameters

##### taskId

`string`

The id of the task to remove.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the task has been removed from the scheduler

***

### tasksInfo() {#tasksinfo}

> **tasksInfo**(): `Promise`\<[`IScheduledTaskInfo`](IScheduledTaskInfo.md)\>

Get the information about the tasks.

#### Returns

`Promise`\<[`IScheduledTaskInfo`](IScheduledTaskInfo.md)\>

The tasks information.
