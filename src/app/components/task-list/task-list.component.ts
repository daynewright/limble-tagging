import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { map, switchMap, of, Observable, forkJoin, shareReplay } from 'rxjs';

import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Task, TaskService, TaskStatus } from '../../services/task.service';
import { Asset, AssetService } from '../../services/asset.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [TaskService],
  imports: [NgFor, NgIf, NgClass, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasks$: Observable<Task[]>;
  asset$: Observable<Asset>;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private assetService: AssetService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    const assetId = this.route.snapshot.paramMap.get('assetId');

    this.asset$ = this.assetService.getAssetById(assetId!).pipe(shareReplay(1));

    this.tasks$ = this.asset$.pipe(
      switchMap((asset) => this.taskService.getTasksByAssetId(asset.id)),
      switchMap((tasks) =>
        forkJoin([
          of(tasks),
          this.userService.getUsersByIds(this.extractUserIdsFromTasks(tasks)),
        ])
      ),
      map(([tasks, users]) =>
        tasks.map((task) => ({
          ...task,
          assignedUser: users.find((user) => user.id === task.assignedTo),
        }))
      )
    );
  }

  getStatusImage(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Ready:
        return 'assets/svgs/checkbox.svg';
      case TaskStatus.InProgress:
        return 'assets/svgs/wrench.svg';
      case TaskStatus.Completed:
        return 'assets/svgs/checkbox.svg';
      default:
        return 'assets/svgs/pause.svg';
    }
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Ready:
        return 'bg-red-100';
      case TaskStatus.InProgress:
        return 'bg-yellow-100';
      case TaskStatus.Completed:
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  }

  extractUserIdsFromTasks(tasks: Task[]): string[] {
    const userIds = new Set<string>();
    tasks.forEach((task) => {
      if (task.assignedTo) {
        userIds.add(task.assignedTo);
      }
    });
    return Array.from(userIds);
  }

  openTaskModal(taskId: string): void {
    this.tasks$
      .pipe(map((tasks) => tasks.find((task) => task.id === taskId)))
      .subscribe((task) => {
        this.dialog.open(TaskModalComponent, {
          width: '90vw',
          maxWidth: '95vw',
          minHeight: '90vh',
          data: { task },
        });
      });
  }
}
