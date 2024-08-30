import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private userUrl = `${environment.apiUrl}/users`;

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  getUsersByIds(userIds: number[]): Observable<User[]> {
    console.log({ userIds }); // Verify the IDs being used
    return this.http.get<User[]>(this.userUrl);
    // .pipe(map((users) => users.filter((user) => userIds.includes(user.id))));
  }
}
