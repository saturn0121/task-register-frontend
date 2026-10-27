import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Assignee, TaskPayload } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Input() task: TaskPayload = {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assigned_to: null,
    due_date: ''
  };
  @Input() users: Assignee[] = [];
  @Input() fieldErrors: { [key: string]: string[] } = {};
  @Input() submitLabel = 'Save';

  @Output() save = new EventEmitter<TaskPayload>();

  // Client-side validation messages. Server-side errors still arrive via fieldErrors.
  clientErrors: { [key: string]: string } = {};
  private submitted = false;

  validate(): boolean {
    const errors: { [key: string]: string } = {};
    const title = (this.task.title ?? '').trim();

    if (!title) {
      errors['title'] = 'Title is required.';
    } else if (title.length > 255) {
      errors['title'] = 'Title must be 255 characters or fewer.';
    }

    if (this.task.due_date) {
      const year = Number(this.task.due_date.slice(0, 4));
      if (isNaN(Date.parse(this.task.due_date)) || year < 2000 || year > 2100) {
        errors['due_date'] = 'Enter a valid due date between 2000 and 2100.';
      }
    }

    this.clientErrors = errors;
    return Object.keys(errors).length === 0;
  }

  // Re-check as the user types, but only after the first failed submit.
  onChange(): void {
    if (this.submitted) {
      this.validate();
    }
  }

  errorFor(field: string): string | null {
    return this.clientErrors[field] ?? this.fieldErrors[field]?.[0] ?? null;
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.validate()) {
      return;
    }
    this.save.emit({ ...this.task, title: this.task.title.trim() });
  }
}
