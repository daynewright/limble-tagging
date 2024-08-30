import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskComment } from '../../services/comment.service';
import { User } from '../../services/user.service';
import { TagInputComponent } from '../tag-input/tag-input.component';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, TagInputComponent],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
})
export class CommentSectionComponent {
  @Input() comments: TaskComment[] = [];
  @Input() users: User[] = [];
  @Output() submitComment = new EventEmitter<string>();

  newCommentMessage: string = '';

  formatCommentForTags(comment: TaskComment['message']) {
    const getTagsRegex = /@(\w+[\w-]*)(?=[\s.!?]|$)/g;
    return comment.replace(
      getTagsRegex,
      '<span class="bg-yellow-100 italic font-semibold">@$1</span>'
    );
  }

  commentSubmit() {
    if (this.newCommentMessage.trim()) {
      this.submitComment.emit(this.newCommentMessage);
      this.newCommentMessage = '';
    }
  }
}
