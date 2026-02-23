# Interface: ITaskSchedulerConstructorOptions

Options for the task scheduler constructor.

## Properties

### loggingComponentType?

> `optional` **loggingComponentType**: `string`

The logging component type.

#### Default

```ts
logging
```

***

### scheduledTaskEntityStorageType?

> `optional` **scheduledTaskEntityStorageType**: `string`

The scheduled task entity storage connector type.

#### Default

```ts
scheduled-task
```

***

### config?

> `optional` **config**: [`ITaskSchedulerConfig`](ITaskSchedulerConfig.md)

The configuration for the task scheduler.
