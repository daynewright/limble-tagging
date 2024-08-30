import { NgClass, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { switchMap, map } from 'rxjs';

import { Task } from '../../services/task.service';
import { TaskComment, CommentService } from '../../services/comment.service';
import { User, UserService } from '../../services/user.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgClass, NgFor, FormsModule, CommentSectionComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  task: Task;
  comments: TaskComment[];
  users: User[];
  newCommentMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<TaskModalComponent>,
    private commentService: CommentService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.task = data.task;
    this.comments = [];
    this.users = [];
  }

  ngOnInit() {
    this.getCommentsByTaskId(this.task.id);
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService
      .getAllUsers()
      .subscribe((users: User[]) => (this.users = users));
  }

  getCommentsByTaskId(taskId: string) {
    this.commentService
      .getAllCommentsByTaskId(taskId)
      .pipe(
        switchMap((comments) => {
          this.comments = comments;
          return this.userService
            .getUsersByIds(comments.map((c) => c.userId))
            .pipe(map((users) => users));
        }),
        map((users) => {
          this.comments = this.comments.map((c) => ({
            ...c,
            user: users.find((u) => u.id === c.userId),
          }));
        })
      )
      .subscribe();
  }

  postCommentByUserId(message: string, userId = 'user-1') {
    this.commentService
      .postCommentByUserId(message, userId, this.task.id)
      .subscribe((comment: TaskComment) => {
        this.comments = [
          ...this.comments,
          {
            ...comment,
            user: this.users.find((u) => u.id === comment.userId),
          },
        ];
      });
  }

  commentSubmit() {
    if (this.newCommentMessage.trim()) {
      this.postCommentByUserId(this.newCommentMessage);
      this.newCommentMessage = '';
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
