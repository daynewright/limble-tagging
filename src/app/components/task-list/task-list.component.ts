import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { map, switchMap } from 'rxjs';

import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Task, TaskService, TaskStatus } from '../../services/task.service';
import { Asset, AssetService } from '../../services/asset.service';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [TaskService],
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private assetService: AssetService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  tasks: Task[] = [];
  users: User[] = [];
  asset: Asset | undefined = undefined;

  ngOnInit() {
    const assetId = this.route.snapshot.paramMap.get('assetId') ?? 'asset-1';
    this.getTasksByAssetId(assetId);
  }

  getStatusImage(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Ready.valueOf():
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

  getTasksByAssetId(assetId: string) {
    this.assetService
      .getAssetById(assetId)
      .pipe(
        switchMap((asset) => {
          this.asset = asset;
          return this.taskService.getTasksByAssetId(assetId);
        }),
        switchMap((tasks) => {
          this.tasks = tasks;
          const userIds = this.extractUserIdsFromTasks(tasks);
          return this.userService
            .getUsersByIds(userIds)
            .pipe(map((users) => ({ tasks, users })));
        }),
        map(({ tasks, users }) => {
          this.users = users;
          this.tasks = tasks.map((task) => ({
            ...task,
            assignedUser: users.find((user) => user.id == task.assignedTo),
          }));
        })
      )
      .subscribe();
  }

  getUsersForTasks(userIds: string[]) {
    this.userService
      .getUsersByIds(userIds)
      .subscribe((users: User[]) => (this.users = users));
  }

  openTaskModal(taskId: string): void {
    this.dialog.open(TaskModalComponent, {
      width: '90vw',
      maxWidth: '95vw',
      minHeight: '90vh',
      data: {
        task: this.tasks.find((task) => task.id === taskId),
      },
    });
  }
}
