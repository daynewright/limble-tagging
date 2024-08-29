import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user.service';

export interface Comment {
  id: number;
  user: User;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor() {}

  getAllCommentsByTaskId(taskId: number): Observable<Comment[]> {
    return of();
  }

  getCommentById(commentId: number): Observable<Comment> {
    return of();
  }
}
