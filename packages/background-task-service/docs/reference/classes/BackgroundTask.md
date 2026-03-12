# Class: BackgroundTask

Class defining a background task.

## Constructors

### Constructor

> **new BackgroundTask**(): `BackgroundTask`

#### Returns

`BackgroundTask`

## Properties

### id {#id}

> **id**: `string`

The id.

***

### type {#type}

> **type**: `string`

The type of the task.

***

### threadId {#threadid}

> **threadId**: `string`

The thread id for the task.

***

### retryInterval? {#retryinterval}

> `optional` **retryInterval**: `number`

The retry interval in milliseconds, undefined if default scheduling.

***

### retriesRemaining? {#retriesremaining}

> `optional` **retriesRemaining**: `number`

The number of retries remaining, undefined if infinite retries.

***

### dateCreated {#datecreated}

> **dateCreated**: `string`

The date the task was created.

***

### dateModified {#datemodified}

> **dateModified**: `string`

The date the task was last modified.

***

### dateNextProcess? {#datenextprocess}

> `optional` **dateNextProcess**: `string`

The date the task is next to be processed.

***

### dateCancelled? {#datecancelled}

> `optional` **dateCancelled**: `string`

The date the task was cancelled.

***

### dateCompleted? {#datecompleted}

> `optional` **dateCompleted**: `string`

The date the task was completed.

***

### retainFor? {#retainfor}

> `optional` **retainFor**: `number`

The amount of time in milliseconds to retain the task after completion.

***

### retainUntil? {#retainuntil}

> `optional` **retainUntil**: `number`

The timestamp of when to retain the task until.

***

### status {#status}

> **status**: `TaskStatus`

The status of the task.

***

### payload? {#payload}

> `optional` **payload**: `unknown`

The payload to execute the task with.

***

### result? {#result}

> `optional` **result**: `unknown`

The result of the execution.

***

### error? {#error}

> `optional` **error**: `IError`

The error at last execution.

***

### contextIds? {#contextids}

> `optional` **contextIds**: `IContextIds`

The context ids that were set at the point the task was created.
