import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink],
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

  toggleUserMenu() {
    this.userMenuVisible = !this.userMenuVisible;
  }
}
