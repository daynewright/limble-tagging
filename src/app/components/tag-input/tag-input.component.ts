import {
  Component,
  ElementRef, // Provides direct access to DOM elements
  EventEmitter, // Used for outputting events from the component
  forwardRef, // Used for forward declarations (required for ControlValueAccessor)
  HostListener, // Listens to DOM events directly on the host element
  Input, // For passing data into the component from a parent
  Output, // For passing data from the component to a parent
  ViewChild, // Allows referencing DOM elements inside the component's template
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'; // Required for creating custom form controls
import { NgIf, NgFor, NgStyle } from '@angular/common'; // Common Angular directives

import { User } from '../../services/user.service'; // User model/interface

@Component({
  selector: 'app-tag-input', // HTML tag for the component
  templateUrl: './tag-input.component.html', // HTML template path
  styleUrls: ['./tag-input.component.css'], // CSS for styling
  standalone: true, // Makes this a standalone component (doesn't need a module)
  imports: [NgIf, NgFor, NgStyle], // Common directives used in the template
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // Registers the component as a form control
      useExisting: forwardRef(() => TagInputComponent), // Allows Angular to use this class before it's fully declared
      multi: true, // Indicates that multiple value accessors can be used (useful for form controls)
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor {
  // Grabs references to DOM elements in the template for programmatic access
  @ViewChild('tagDropdown') tagDropdownRef!: ElementRef<HTMLUListElement>;
  @ViewChild('mainInput') mainInputRef!: ElementRef<HTMLInputElement>;

  // Takes a list of users as input (passed from parent)
  @Input() users: User[] = [];

  // Outputs the selected user IDs when a user is tagged
  @Output() taggedUserIdsChange = new EventEmitter<User['id'][]>();

  private _value: string = ''; // Stores the current input value
  private onChange = (value: string) => {}; // Placeholder for onChange function, registered via `registerOnChange`

  filteredUsers: User[] = []; // List of users filtered based on input
  taggedUserIds: User['id'][] = []; // Keeps track of tagged users' IDs
  showSuggestions: boolean = false; // Determines if the user suggestions dropdown is visible

  // Controls the dropdown's positioning
  dropdownTop: number = 45;
  dropdownLeft: number = 5;

  // Tracks which item in the dropdown is highlighted for keyboard navigation
  arrowkeyLocation: number = -1;

  // Getter and setter for the value of the input field
  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val; // Sets the internal value
    this.onChange(val); // Triggers onChange for form control integration
  }

  // Handles input events, checks if an "@" symbol is present to trigger suggestions
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value; // Updates the input value
    this.showSuggestions = this.value.includes('@'); // Shows suggestions when "@" is detected

    if (this.showSuggestions) {
      this.dropdownLeft = this.value.length * 6.5; // Dynamically adjusts dropdown position
      this.showUserSuggestions(this.value); // Filters users based on the input value
    } else {
      this.filteredUsers = []; // Hides suggestions if no "@" is present
    }
  }

  //TODO: Create DIRECTIVE
  // Listens to keyboard events (e.g., arrow keys, enter key) for navigating the dropdown
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.showSuggestions) return; // If no suggestions, skip key navigation

    if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevents default scrolling behavior

      this.arrowkeyLocation++; // Moves selection down in the list
      this.updateHighlightedItem(); // Updates the highlighted item visually
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // Prevents default scrolling behavior

      this.arrowkeyLocation--; // Moves selection up in the list
      this.updateHighlightedItem(); // Updates the highlighted item visually
    } else if (event.key === 'Enter') {
      // Selects the user when "Enter" is pressed
      if (
        this.arrowkeyLocation >= 0 &&
        this.arrowkeyLocation < this.filteredUsers.length
      ) {
        event.preventDefault(); // Prevents default scrolling behavior

        this.selectUser(this.filteredUsers[this.arrowkeyLocation]); // Selects the currently highlighted user
        this.arrowkeyLocation = 0; // Resets the arrow key location
      }
    }
  }

  //TODO: Create DIRECTIVE
  // Highlights the currently selected item in the dropdown based on arrow key navigation
  private updateHighlightedItem() {
    if (this.arrowkeyLocation >= this.filteredUsers.length) {
      this.arrowkeyLocation = this.filteredUsers.length - 1; // Ensures the location is within bounds
    } else if (this.arrowkeyLocation < 0) {
      this.arrowkeyLocation = 0; // Prevents negative index
    }

    // Updates the DOM to highlight the selected item visually
    const items = this.tagDropdownRef.nativeElement.querySelectorAll('li');
    items.forEach((item: HTMLElement, index: number) => {
      if (index === this.arrowkeyLocation) {
        item.classList.add('bg-gray-100'); // Adds highlight class
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scrolls to the item smoothly
      } else {
        item.classList.remove('bg-gray-100'); // Removes highlight class from other items
      }
    });
  }

  // Filters the list of users based on the input after the "@" symbol
  showUserSuggestions(input: string) {
    const searchTerm = input.split('@').pop(); // Extracts the string after "@"
    if (searchTerm) {
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ); // Filters users based on the search term
      if (!this.filteredUsers.length) {
        this.showSuggestions = false; // Hides suggestions if no users match
      }
    } else {
      this.filteredUsers = this.users; // Shows all users if no search term is present
    }
  }

  // Handles user selection from the suggestions dropdown
  selectUser(user: User) {
    // Adds the selected user's ID to the tagged users, ensuring no duplicates
    this.taggedUserIds = Array.from(new Set([...this.taggedUserIds, user.id]));
    this.taggedUserIdsChange.emit(this.taggedUserIds); // Emits the new list of tagged user IDs

    const parts = this.value.split('@');
    parts.pop(); // Removes the last part (user search term) from the input

    this.value = `${parts.join('@')}@${user.name}`; // Replaces it with the selected user's name
    this.filteredUsers = []; // Clears the suggestions dropdown
    this.showSuggestions = false; // Hides the dropdown
    this.mainInputRef.nativeElement.focus(); // Refocuses the input field
  }

  // ControlValueAccessor methods for form control integration
  writeValue(value: string): void {
    this.value = value; // Updates the internal value
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn; // Registers a callback for when the value changes
  }

  registerOnTouched(fn: () => void): void {
    // Placeholder for touched event registration, not needed in this case
  }
}
