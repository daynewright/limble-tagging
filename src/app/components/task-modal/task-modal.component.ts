import { NgClass, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../services/task.service';
import { Comment, CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  task: Task;
  comments: Comment[];

  constructor(
    public dialogRef: MatDialogRef<TaskModalComponent>,
    private commentService: CommentService,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.task = data.task;
    this.comments = [];
  }

  ngOnInit() {
    this.getCommentsByTaskId(this.task.id);
  }

  getCommentsByTaskId(taskId: number) {
    this.commentService
      .getAllCommentsByTaskId(taskId)
      .subscribe((comments: Comment[]) => (this.comments = comments));
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
