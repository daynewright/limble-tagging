import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface TaskComment {
  id: string;
  userId: string;
  user?: User;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  private commentUrl = `${environment.apiUrl}/comments`;

  getAllCommentsByTaskId(taskId: string): Observable<TaskComment[]> {
    return this.http.get<TaskComment[]>(`${this.commentUrl}?taskId=${taskId}`);
  }

  getCommentById(commentId: string): Observable<TaskComment> {
    return this.http.get<TaskComment>(`${this.commentUrl}/${commentId}`);
  }

  postCommentByUserId(
    message: string,
    userId: string,
    taskId: string
  ): Observable<TaskComment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<TaskComment>(
      this.commentUrl,
      { message, userId, taskId },
      { headers }
    );
  }
}
