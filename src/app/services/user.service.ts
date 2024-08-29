import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class userService {
  constructor() {}

  getAllUsers(): Observable<User[]> {
    return of();
  }

  getUserById(userId: number): Observable<User[]> {
    return of();
  }
}
