import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgIf, NgFor, NgStyle, AsyncPipe } from '@angular/common';

import { User } from '../../services/user.service';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, AsyncPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild('tagDropdown') tagDropdownRef!: ElementRef<HTMLUListElement>;
  @ViewChild('mainInput') mainInputRef!: ElementRef<HTMLInputElement>;

  @Output() taggedUserIdsChange = new EventEmitter<User['id'][]>();
  @Input() users$!: Observable<User[]>;

  private _value: string = '';
  private onChange = (value: string) => {};

  filteredUsers$ = new BehaviorSubject<User[]>([]);
  private valueChanges$ = new Subject<string>();

  taggedUserIds: User['id'][] = [];
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

  ngOnInit() {
    this.valueChanges$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((inputValue) => this.showUserSuggestions(inputValue))
      )
      .subscribe();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.showSuggestions = this.value.includes('@');

    if (this.showSuggestions) {
      this.dropdownLeft = this.value.length * 6.5;
      this.valueChanges$.next(this.value);
    } else {
      this.filteredUsers$.next([]);
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
        this.arrowkeyLocation < this.filteredUsers$.getValue().length
      ) {
        event.preventDefault();
        this.selectUser(this.filteredUsers$.getValue()[this.arrowkeyLocation]);
        this.arrowkeyLocation = 0;
      }
    }
  }

  private updateHighlightedItem() {
    if (this.arrowkeyLocation >= this.filteredUsers$.getValue().length) {
      this.arrowkeyLocation = this.filteredUsers$.getValue().length - 1;
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

  showUserSuggestions(input: string): Observable<User[]> {
    const searchTerm = input.split('@').pop();

    return this.users$.pipe(
      switchMap((users) => {
        const filteredUsers = searchTerm?.length
          ? users.filter((user) =>
              user.name
                .toLocaleLowerCase()
                .includes(searchTerm.toLocaleLowerCase())
            )
          : users;

        return of(filteredUsers);
      }),
      tap((filteredUsers) => {
        if (filteredUsers.length) {
          this.filteredUsers$.next(filteredUsers);
        } else {
          this.showSuggestions = false;
        }
      }),
      catchError((error) => {
        console.error('Error fetching user suggestions:', error);
        this.filteredUsers$.next([]);
        return of([]);
      })
    );
  }

  selectUser(user: User) {
    this.taggedUserIds = Array.from(new Set([...this.taggedUserIds, user.id]));
    this.taggedUserIdsChange.emit(this.taggedUserIds);

    const parts = this.value.split('@');
    parts.pop();

    this.value = `${parts.join('@')}@${user.name}`;
    this.filteredUsers$.next([]);
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
