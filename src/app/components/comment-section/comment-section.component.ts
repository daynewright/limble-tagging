import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs';

import { TagInputComponent } from '../tag-input/tag-input.component';

import { CommentService, TaskComment } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, TagInputComponent],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
})
export class CommentSectionComponent {
  @Input() taskId!: Task['id'];

  authUser: User | undefined;
  users: User[] = [];
  comments: TaskComment[] = [];
  newCommentMessage: string = '';
  taggedUserIds: User['id'][] = [];

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getCommentsByTaskId(this.taskId);
    this.getAllUsers();

    this.authService.authUser$.subscribe(
      (authUser) => (this.authUser = authUser)
    );
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

  postCommentByUserId(message: string) {
    this.commentService
      .postCommentByUserId(
        message,
        this.authUser!.id,
        this.taskId,
        this.taggedUserIds
      )
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

  onTaggedUserIdsChange(taggedUserIds: User['id'][]): void {
    this.taggedUserIds = taggedUserIds;
  }

  commentSubmit() {
    if (this.newCommentMessage.trim()) {
      this.postCommentByUserId(this.newCommentMessage);

      this.newCommentMessage = '';
      this.taggedUserIds = [];
    }
  }

  formatCommentForTags(comment: TaskComment['message']) {
    const getTagsRegex = /@(\w+[\w-]*)(?=[\s.!?]|$)/g;
    return comment.replace(
      getTagsRegex,
      '<span class="bg-yellow-100 px-1 rounded-sm font-semibold">@$1</span>'
    );
  }
}
