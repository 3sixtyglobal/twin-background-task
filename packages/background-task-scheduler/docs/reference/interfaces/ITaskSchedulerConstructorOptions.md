# Interface: ITaskSchedulerConstructorOptions

Options for the task scheduler constructor.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The logging component type.

#### Default

```ts
logging
```

***

### scheduledTaskEntityStorageType? {#scheduledtaskentitystoragetype}

> `optional` **scheduledTaskEntityStorageType?**: `string`

The scheduled task entity storage connector type.

#### Default

```ts
scheduled-task
```

***

### config? {#config}

> `optional` **config?**: [`ITaskSchedulerConfig`](ITaskSchedulerConfig.md)

The configuration for the task scheduler.
