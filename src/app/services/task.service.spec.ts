import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { Task, TaskStatus, TaskService } from './task.service';
import { Asset } from './asset.service';

describe('taskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockAsset: Asset = {
    id: '1',
    name: 'Boiler Room',
    taskIds: ['1', '2', '4'],
  };

  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Replace flux capacitor',
      status: TaskStatus.Ready,
      commentIds: ['1', '2', '3'],
    },
    {
      id: '2',
      name: 'Change tires',
      status: TaskStatus.InProgress,
    },
    {
      id: '3',
      name: 'Should not be done',
      status: TaskStatus.Paused,
    },
    {
      id: '4',
      name: 'Another thing to do',
      status: TaskStatus.Ready,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('can create taskService', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks by assetId', () => {
    const assetTasks = mockTasks.filter(
      (task) => !mockAsset.taskIds?.includes(task.id)
    );

    service.getTasksByAssetId(mockAsset.id).subscribe((tasks) => {
      expect(tasks).toEqual(assetTasks);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks?assetId=${mockAsset.id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(assetTasks);
  });

  it('should get task by id', () => {
    const mockTask = mockTasks[0];

    service.getTaskById(mockTask.id).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks/${mockTask.id}`
    );

    expect(req.request.method).toBe('GET');
  });
});
