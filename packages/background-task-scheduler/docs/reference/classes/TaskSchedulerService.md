# Class: TaskSchedulerService

Class for scheduling tasks.

## Implements

- `ITaskSchedulerComponent`

## Constructors

### Constructor

> **new TaskSchedulerService**(`options?`): `TaskSchedulerService`

Create a new instance of TaskSchedulerComponent.

#### Parameters

##### options?

[`ITaskSchedulerConstructorOptions`](../interfaces/ITaskSchedulerConstructorOptions.md)

The options for the scheduler.

#### Returns

`TaskSchedulerService`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`ITaskSchedulerComponent.className`

***

### stop() {#stop}

> **stop**(`nodeLoggingComponentType?`): `Promise`\<`void`\>

The component needs to be stopped when the node is closed.

#### Parameters

##### nodeLoggingComponentType?

`string`

The node logging component type.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the scheduler has stopped and in-flight tasks have been reset

#### Implementation of

`ITaskSchedulerComponent.stop`

***

### addTask() {#addtask}

> **addTask**(`taskId`, `times`, `taskCallback`): `Promise`\<`void`\>

Add a task to the scheduler.

#### Parameters

##### taskId

`string`

The id of the task to add.

##### times

`IScheduledTaskTime`[]

The times at which the task should be scheduled.

##### taskCallback

() => `Promise`\<`void`\>

The callback to execute when the task is scheduled.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the task has been registered and the scheduler timer started

#### Implementation of

`ITaskSchedulerComponent.addTask`

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

A promise that resolves when the task has been removed

#### Implementation of

`ITaskSchedulerComponent.removeTask`

***

### tasksInfo() {#tasksinfo}

> **tasksInfo**(): `Promise`\<`IScheduledTaskInfo`\>

Get the information about the tasks.

#### Returns

`Promise`\<`IScheduledTaskInfo`\>

The tasks information.

#### Implementation of

`ITaskSchedulerComponent.tasksInfo`
