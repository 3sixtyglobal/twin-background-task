# Background Task Service Examples

Use these snippets to register workers, queue jobs and manage task lifecycles from creation through retention.

## BackgroundTaskService

```typescript
import { BackgroundTaskService } from '@3sixty/background-task-service';

const taskService = new BackgroundTaskService({
  config: {
    maxSystemWorkerCount: 4,
    taskInterval: 200,
    retryInterval: 3000,
    cleanupInterval: 30000
  }
});

console.log(taskService.className()); // BackgroundTaskService
```

```typescript
import type { IBackgroundTask } from '@3sixty/background-task-models';
import { TaskStatus } from '@3sixty/background-task-models';
import { BackgroundTaskService } from '@3sixty/background-task-service';

type ThumbnailPayload = {
  imageId: string;
  width: number;
};

type ThumbnailResult = {
  imageId: string;
  fileName: string;
};

const taskService = new BackgroundTaskService();

await taskService.start();

await taskService.registerHandler<ThumbnailPayload, ThumbnailResult>(
  'thumbnail-generate',
  './workers/thumbnailWorker',
  'generate',
  async (task: IBackgroundTask<ThumbnailPayload, ThumbnailResult>) => {
    if (task.status === TaskStatus.Success) {
      console.log(task.result?.fileName); // hero-600.webp
    }
  },
  {
    maxWorkerCount: 2,
    idleShutdownTimeout: 45000,
    initialiseMethod: 'initialise',
    shutdownMethod: 'shutdown'
  }
);

const taskId = await taskService.create<ThumbnailPayload>(
  'thumbnail-generate',
  {
    imageId: 'hero',
    width: 600
  },
  {
    retryCount: 3,
    retryInterval: 2500,
    retainFor: 60000
  }
);

console.log(taskId.startsWith('background-task:entity-storage:')); // true
```

```typescript
import { TaskStatus } from '@3sixty/background-task-models';
import { SortDirection } from '@3sixty/entity';
import { BackgroundTaskService } from '@3sixty/background-task-service';

type ThumbnailPayload = {
  imageId: string;
  width: number;
};

type ThumbnailResult = {
  imageId: string;
  fileName: string;
};

const taskService = new BackgroundTaskService();

const taskId = await taskService.create<ThumbnailPayload>('thumbnail-generate', {
  imageId: 'hero',
  width: 600
});

const task = await taskService.get<ThumbnailPayload, ThumbnailResult>(taskId);
console.log(task?.type); // thumbnail-generate

const page = await taskService.query(
  'thumbnail-generate',
  TaskStatus.Pending,
  'dateCreated',
  SortDirection.Ascending
);

console.log(page.entities.length); // 1
```

```typescript
import { BackgroundTaskService } from '@3sixty/background-task-service';

const taskService = new BackgroundTaskService();

const taskId = await taskService.create('thumbnail-generate', {
  imageId: 'hero',
  width: 600
});

await taskService.cancel(taskId);

const cancelledTask = await taskService.get(taskId);
console.log(cancelledTask?.dateCancelled !== undefined); // true
```

```typescript
import { BackgroundTaskService } from '@3sixty/background-task-service';

const taskService = new BackgroundTaskService();

const taskId = await taskService.create('thumbnail-generate', {
  imageId: 'hero',
  width: 600
});

await taskService.retry(taskId);
await taskService.remove(taskId);

const removedTask = await taskService.get(taskId);
console.log(removedTask); // undefined

await taskService.unregisterHandler('thumbnail-generate');
await taskService.stop();
```

## BackgroundTask

```typescript
import { TaskStatus } from '@3sixty/background-task-models';
import { BackgroundTask } from '@3sixty/background-task-service';

const now = new Date().toISOString();
const entity = new BackgroundTask();
entity.id = 'f86508fca4b14d55b0f9bdbb0a6032ad';
entity.type = 'thumbnail-generate';
entity.threadId = '0';
entity.dateCreated = now;
entity.dateModified = now;
entity.status = TaskStatus.Pending;
entity.payload = {
  imageId: 'hero',
  width: 600
};

console.log(entity.status); // pending
```

## initSchema

```typescript
import { initSchema } from '@3sixty/background-task-service';

initSchema();
```
