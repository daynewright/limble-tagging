import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  constructor(public dialogRef: MatDialogRef<TaskModalComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
