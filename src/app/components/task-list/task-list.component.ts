import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  constructor(private dialog: MatDialog) {}

  openTaskModal(): void {
    this.dialog.open(TaskModalComponent, {
      width: '90vw', // Set to 90% of the viewport width
      maxWidth: '95vw', // Ensure it does not exceed 95% of viewport width
      height: '80vh', // Optional: Adjust height as needed
      data: {
        /* any data you want to pass to the modal */
      },
    });
  }
}
