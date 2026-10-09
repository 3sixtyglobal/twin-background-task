# Background Task Models Examples

Use these snippets to model task payloads, status transitions and scheduler contracts in a strongly typed way.

## IBackgroundTask

```typescript
import type { IBackgroundTask } from '@3sixty/background-task-models';
import { TaskStatus } from '@3sixty/background-task-models';

type ImportPayload = {
  source: string;
  batchSize: number;
};

type ImportResult = {
  inserted: number;
  skipped: number;
};

const queuedTask: IBackgroundTask<ImportPayload, ImportResult> = {
  id: '7f4b2c18a4f44f1f9ff7348e260ca4c2',
  type: 'catalogue-import',
  threadId: '0',
  dateCreated: '2026-03-09T10:30:00.000Z',
  dateModified: '2026-03-09T10:30:00.000Z',
  status: TaskStatus.Pending,
  payload: {
    source: 'tenant-a',
    batchSize: 250
  },
  retriesRemaining: 3,
  retryInterval: 5000
};

console.log(queuedTask.status); // pending
```

```typescript
import type { IBackgroundTask } from '@3sixty/background-task-models';
import { TaskStatus } from '@3sixty/background-task-models';

type ImportResult = {
  inserted: number;
  skipped: number;
};

const completedTask: IBackgroundTask<unknown, ImportResult> = {
  id: '7f4b2c18a4f44f1f9ff7348e260ca4c2',
  type: 'catalogue-import',
  threadId: '3',
  dateCreated: '2026-03-09T10:30:00.000Z',
  dateModified: '2026-03-09T10:31:22.000Z',
  dateCompleted: '2026-03-09T10:31:22.000Z',
  status: TaskStatus.Success,
  result: {
    inserted: 248,
    skipped: 2
  }
};

console.log(completedTask.result?.inserted); // 248
```

## IBackgroundTaskComponent

```typescript
import type { IBackgroundTask, IBackgroundTaskComponent } from '@3sixty/background-task-models';
import { TaskStatus } from '@3sixty/background-task-models';

type ResizePayload = {
  imageId: string;
  width: number;
  height: number;
};

type ResizeResult = {
  imageId: string;
  location: string;
};

export async function configureImageHandler(
  taskComponent: IBackgroundTaskComponent
): Promise<void> {
  await taskComponent.registerHandler<ResizePayload, ResizeResult>(
    'image-resize',
    './workers/imageWorker',
    'resize',
    async (task: IBackgroundTask<ResizePayload, ResizeResult>) => {
      if (task.status === TaskStatus.Success) {
        console.log(task.result?.location); // s3://tenant-a/images/hero-1920x1080.webp
      }
    },
    {
      maxWorkerCount: 4,
      idleShutdownTimeout: 60000,
      initialiseMethod: 'initialise',
      shutdownMethod: 'shutdown'
    }
  );

  const taskId = await taskComponent.create<ResizePayload>(
    'image-resize',
    {
      imageId: 'hero',
      width: 1920,
      height: 1080
    },
    {
      retryCount: 2,
      retryInterval: 3000,
      retainFor: 120000
    }
  );

  const task = await taskComponent.get<ResizePayload, ResizeResult>(taskId);
  console.log(task?.status); // pending
}
```

## ITaskSchedulerComponent

```typescript
import type { ITaskSchedulerComponent } from '@3sixty/background-task-models';

export async function registerDailySync(
  scheduler: ITaskSchedulerComponent,
  syncTaskId: string
): Promise<void> {
  await scheduler.addTask(
    syncTaskId,
    [
      {
        nextTriggerTime: Date.now() + 15 * 60 * 1000,
        intervalDays: 1
      }
    ],
    async () => {
      console.log('sync running at', new Date().toISOString()); // sync running at 2026-03-09T10:45:00.000Z
    }
  );

  const info = await scheduler.tasksInfo();
  console.log(info.tasks[syncTaskId].length); // 1
}
```

## IScheduledTaskInfo and IScheduledTaskTime

```typescript
import type { IScheduledTaskInfo, IScheduledTaskTime } from '@3sixty/background-task-models';

const everyQuarterHour: IScheduledTaskTime = {
  intervalMinutes: 15
};

const schedule: IScheduledTaskInfo = {
  tasks: {
    'cleanup-cache': [everyQuarterHour]
  }
};

console.log(schedule.tasks['cleanup-cache'][0].intervalMinutes); // 15
```

## TaskStatus

```typescript
import type { TaskStatus } from '@3sixty/background-task-models';
import { TaskStatus as TaskStatuses } from '@3sixty/background-task-models';

const terminalStatuses: TaskStatus[] = [
  TaskStatuses.Success,
  TaskStatuses.Failed,
  TaskStatuses.Cancelled
];

console.log(terminalStatuses.join(', ')); // success, failed, cancelled
```
