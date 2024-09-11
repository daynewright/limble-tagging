import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { switchMap, map, Observable, shareReplay, of } from 'rxjs';

import { Task } from '../../services/task.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgClass, NgFor, FormsModule, CommentSectionComponent, AsyncPipe],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  task: Task;

  constructor(
    public dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.task = data.task;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
