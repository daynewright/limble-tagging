import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Comment {
  id: number;
  user: User;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  private commentUrl = `${environment.apiUrl}/comments`;

  getAllCommentsByTaskId(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentUrl}?taskId=${taskId}`);
  }

  getCommentById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.commentUrl}/${commentId}`);
  }
}
