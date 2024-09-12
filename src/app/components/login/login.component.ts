import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

import { AuthService } from './../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { ROUTES } from '../../routes.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  authUser: User | undefined;
  selectedUserId: User['id'] | undefined;
  users: User[] = [];

  ngOnInit() {
    this.getUsers();
    this.getAuthUser();

    if (this.authUser) {
      this.router.navigate([ROUTES.ASSETS]);
    }
  }

  getAuthUser() {
    this.authService.authUser$.subscribe((authUser) => (authUser = authUser));
  }

  getUsers() {
    this.userService.getAllUsers().subscribe((users) => (this.users = users));
  }

  loginUser() {
    const user = this.users.find((u) => u.id === this.selectedUserId);
    if (user) {
      this.authService.setAuthUser(user);
      this.router.navigate([ROUTES.ASSETS]);
    } else {
      console.error(`Unable to find user ${this.selectedUserId}`);
    }
  }

  onUserChange($event: Event) {
    this.selectedUserId = ($event.target as HTMLSelectElement).value;
  }
}
