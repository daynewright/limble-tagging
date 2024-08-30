import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskComment } from '../../services/comment.service';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
})
export class CommentSectionComponent {
  @Input() comments: TaskComment[] = [];
  @Input() users: User[] = [];
  @Output() submitComment = new EventEmitter<string>();

  newCommentMessage: string = '';

  commentSubmit() {
    if (this.newCommentMessage.trim()) {
      this.submitComment.emit(this.newCommentMessage);
      this.newCommentMessage = '';
    }
  }
}
