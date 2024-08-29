import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Task, TaskService, TaskStatus } from '../../services/task.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [TaskService],
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  constructor(private dialog: MatDialog, private taskService: TaskService) {}
  tasks: Task[] = [];

  ngOnInit() {
    this.getTasksByAssetId(1);
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

  getTasksByAssetId(assetId: number) {
    this.taskService
      .getTasksByAssetId(1)
      .subscribe((tasks: Task[]) => (this.tasks = tasks));
  }

  openTaskModal(): void {
    this.dialog.open(TaskModalComponent, {
      width: '90vw',
      maxWidth: '95vw',
      height: '80vh',
      data: {},
    });
  }
}
