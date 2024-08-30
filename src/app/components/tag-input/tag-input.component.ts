import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgIf, NgFor, NgStyle } from '@angular/common';

import { User } from '../../services/user.service';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgStyle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() users: User[] = [];

  private _value: string = '';
  private onChange = (value: string) => {};

  filteredUsers: User[] = [];
  showSuggestions: boolean = false;

  dropdownTop: number = 45;
  dropdownLeft: number = 5;

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.showSuggestions = this.value.includes('@');

    if (this.showSuggestions) {
      this.dropdownLeft = this.value.length * 6.5;
      this.showUserSuggestions(this.value);
    } else {
      this.filteredUsers = [];
    }
  }

  showUserSuggestions(input: string) {
    const searchTerm = input.split('@').pop();
    if (searchTerm) {
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!this.filteredUsers.length) {
        this.showSuggestions = false;
      }
    } else {
      this.filteredUsers = this.users;
    }
  }

  selectUser(user: User) {
    const parts = this.value.split('@');
    parts.pop();
    this.value = `${parts.join('@')}@${user.name}`;
    this.filteredUsers = [];
    this.showSuggestions = false;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {}
}
