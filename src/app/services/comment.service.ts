import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.service';
import { Task } from './task.service';

export interface TaskComment {
  id: string;
  userId: string;
  user?: User;
  message: string;
  taggedUserIds?: User['id'][];
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  private commentUrl = `${environment.apiUrl}/comments`;

  getAllCommentsByTaskId(taskId: Task['id']): Observable<TaskComment[]> {
    return this.http.get<TaskComment[]>(`${this.commentUrl}?taskId=${taskId}`);
  }

  getCommentById(commentId: TaskComment['id']): Observable<TaskComment> {
    return this.http.get<TaskComment>(`${this.commentUrl}/${commentId}`);
  }

  getTaggedCommentsForUser(userId: User['id']): Observable<TaskComment[]> {
    return this.http.get<TaskComment[]>(
      `${this.commentUrl}?taggedUserIds=${userId}`
    );
  }

  postCommentByUserId(
    message: string,
    userId: User['id'],
    taskId: Task['id'],
    taggedUserIds: User['id'][]
  ): Observable<TaskComment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<TaskComment>(
      this.commentUrl,
      { message, userId, taskId, taggedUserIds },
      { headers }
    );
  }
}
