import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { User } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  authUser: User | undefined = undefined;
  users: User[] = [];
  notifications: { name: string }[] = [];

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getLoggedInUser();
    this.getUsers();
    this.getNotificationsForUser();
  }

  getUsers() {
    this.userService.getAllUsers().subscribe((users) => (this.users = users));
  }

  getNotificationsForUser() {
    if (this.authUser) {
      this.commentService.getTaggedCommentsForUser(this.authUser.id).subscribe(
        (comments) =>
          (this.notifications = comments.map((c) => ({
            name: this.users.find((u) => u.id === c.userId)?.name ?? 'UNKNOWN',
          })))
      );
    }
  }

  getLoggedInUser() {
    this.authService.authUser$.subscribe(
      (authUser) => (this.authUser = authUser)
    );
  }
}
