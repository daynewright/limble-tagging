import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from './user.service';
import { environment } from '../../environments/environment';

export enum TaskStatus {
  Ready = 'Ready',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Paused = 'Paused',
}

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  assignedTo?: User;
  notes?: string;
  comments?: Comment[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}
  private taskUrl = `${environment.apiUrl}/tasks`;

  getTasksByAssetId(assetId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskUrl}?assetId=${assetId}`);
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.taskUrl}/${taskId}`);
  }
}
