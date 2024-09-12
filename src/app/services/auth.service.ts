// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUserSubject = new BehaviorSubject<User | undefined>(undefined);
  authUser$: Observable<User | undefined> = this.authUserSubject.asObservable();

  constructor() {
    // Initialize current user from localStorage if available
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      this.authUserSubject.next(JSON.parse(storedUser));
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('authUser');
  }

  // Method to set the logged-in user
  setAuthUser(user: User) {
    this.authUserSubject.next(user);
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  // Method to clear the logged-in user
  clearAuthUser() {
    this.authUserSubject.next(undefined);
    localStorage.removeItem('authUser');
  }
}
