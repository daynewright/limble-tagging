import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TaskComment } from './comment.service';
import { User } from './user.service';

export enum TaskStatus {
  Ready = 'Ready',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Paused = 'Paused',
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  assignedTo?: string;
  assignedUser?: User;
  notes?: string;
  commentIds?: string[];
  comments?: TaskComment[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}
  private taskUrl = `${environment.apiUrl}/tasks`;

  getTasksByAssetId(assetId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskUrl}?assetId=${assetId}`);
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.taskUrl}/${taskId}`);
  }
}
