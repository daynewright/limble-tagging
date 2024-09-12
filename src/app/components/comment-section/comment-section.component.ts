import { Observable, BehaviorSubject, switchMap, map, shareReplay } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TagInputComponent } from '../tag-input/tag-input.component';
import { CommentService, TaskComment } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, TagInputComponent, AsyncPipe],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
})
export class CommentSectionComponent implements OnInit {
  @Input() taskId!: Task['id'];

  authUser$: Observable<User | undefined>;
  users$: Observable<User[]>;
  comments$: Observable<TaskComment[]>;

  private commentsSubject = new BehaviorSubject<TaskComment[]>([]);
  newCommentMessage: string = '';
  taggedUserIds: User['id'][] = [];

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$.pipe(shareReplay(1));
    this.users$ = this.userService.getAllUsers().pipe(shareReplay(1));

    this.comments$ = this.commentsSubject.asObservable().pipe(
      switchMap((comments) =>
        this.users$.pipe(
          map((users) =>
            comments.map((comment) => ({
              ...comment,
              user: users.find((user) => user.id === comment.userId),
            }))
          )
        )
      )
    );
  }

  ngOnInit() {
    if (this.taskId) {
      this.getAllComments();
    } else {
      console.error('TASKID is missing');
    }
  }

  private getAllComments() {
    this.commentService
      .getAllCommentsByTaskId(this.taskId)
      .subscribe((comments) => this.commentsSubject.next(comments));
  }

  postCommentByUserId(message: string) {
    this.authUser$
      .pipe(
        switchMap((authUser) =>
          this.commentService.postCommentByUserId(
            message,
            authUser?.id!,
            this.taskId,
            this.taggedUserIds
          )
        ),
        switchMap(() => this.commentService.getAllCommentsByTaskId(this.taskId))
      )
      .subscribe((comments) => this.commentsSubject.next(comments));
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
