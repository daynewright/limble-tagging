import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
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
  @ViewChild('tagDropdown') tagDropdownRef!: ElementRef<HTMLUListElement>;
  @ViewChild('mainInput') mainInputRef!: ElementRef<HTMLInputElement>;

  @Input() users: User[] = [];
  @Output() taggedUsersChange = new EventEmitter<User[]>();

  private _atIndex: number = -1;

  private _value: string = '';
  private onChange = (value: string) => {};

  filteredUsers: User[] = [];
  taggedUsers: User[] = [];
  showSuggestions: boolean = false;

  dropdownTop: number = 45;
  dropdownLeft: number = 5;
  arrowkeyLocation: number = -1;

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    const cursorPosition = input.selectionStart ?? 0;
    const atIndex = input.value.lastIndexOf('@', cursorPosition - 1);
    const searchName = input.value.substring(atIndex + 1, cursorPosition);

    const hasAtIndex = atIndex !== -1;
    const atIndexFirst = atIndex === 0;
    const noCharBeforeAtIndex = !/[a-zA-Z]/.test(input.value[atIndex - 1]);

    this.showSuggestions = hasAtIndex && (atIndexFirst || noCharBeforeAtIndex);

    this.value = input.value;
    this._atIndex = atIndex;

    if (this.showSuggestions) {
      this.dropdownLeft = cursorPosition * 6.5;
      this.showUserSuggestions(searchName);
    } else {
      this.filteredUsers = [];
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.showSuggestions) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (this.tagDropdownRef) {
        this.tagDropdownRef.nativeElement.focus();
        this.arrowkeyLocation++;
        this.updateHighlightedItem();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (this.tagDropdownRef && this.arrowkeyLocation > 0) {
        this.arrowkeyLocation--;
        this.updateHighlightedItem();
      }
    } else if (event.key === 'Enter') {
      if (
        this.arrowkeyLocation >= 0 &&
        this.arrowkeyLocation < this.filteredUsers.length
      ) {
        event.preventDefault();
        this.selectUser(this.filteredUsers[this.arrowkeyLocation]);
        this.arrowkeyLocation = 0;
      }
    }
  }

  private updateHighlightedItem() {
    if (this.arrowkeyLocation >= this.filteredUsers.length) {
      this.arrowkeyLocation = this.filteredUsers.length - 1;
    } else if (this.arrowkeyLocation < 0) {
      this.arrowkeyLocation = 0;
    }

    const items = this.tagDropdownRef.nativeElement.querySelectorAll('li');
    items.forEach((item: HTMLElement, index: number) => {
      if (index === this.arrowkeyLocation) {
        item.classList.add('bg-gray-100');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('bg-gray-100');
      }
    });
  }

  showUserSuggestions(searchName?: string) {
    if (searchName) {
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
      );
      if (!this.filteredUsers.length) {
        this.showSuggestions = false;
      }
    } else {
      this.filteredUsers = this.users;
    }
  }

  selectUser(user: User) {
    this.taggedUsers = Array.from(new Set([...this.taggedUsers, user]));
    this.taggedUsersChange.emit(this.taggedUsers);

    const endOfNameIndex = this.value.indexOf(' ', this._atIndex + 1);
    const endIndex = endOfNameIndex !== -1 ? endOfNameIndex : this.value.length;

    const beforeAt = this.value.slice(0, this._atIndex);
    const afterAt = this.value.slice(endIndex);

    this.value = `${beforeAt}@${user.name}${afterAt}`;

    this.filteredUsers = [];
    this.showSuggestions = false;
    this.mainInputRef.nativeElement.focus();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {}
}
