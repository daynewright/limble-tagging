import { NgIf } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router, RouterLink } from '@angular/router';

import { ROUTES } from '../../routes.constants';
import { AuthService } from './../../services/auth.service';
import { User } from '../../services/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, NotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('200ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent {
  userMenuVisible = false;
  notficationsVisible = false;
  authUser: User | undefined = undefined;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getLoggedInUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.userMenuVisible = false;
      this.notficationsVisible = false;
    }
  }

  getLoggedInUser() {
    this.authService.authUser$.subscribe(
      (authUser) => (this.authUser = authUser)
    );
  }

  logoutUser() {
    this.authService.clearAuthUser();
    this.router.navigate([ROUTES.LOGIN]);
  }

  toggleUserMenu() {
    this.userMenuVisible = !this.userMenuVisible;
  }

  toggleNotifications() {
    this.notficationsVisible = !this.notficationsVisible;
  }
}
