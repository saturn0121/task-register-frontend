  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { TaskService } from '../../services/task.service';

  @Component({
    selector: 'app-task-create',
    imports: [CommonModule, FormsModule],
    templateUrl: './task-create.component.html',
    styleUrl: './task-create.component.css'
  })
  export class TaskCreateComponent {
    title = '';
    description = '';
    status = 'open';
    due_date = '';

    errorMessage = '';
    fieldErrors: { [key: string]: string[] } = {};

    constructor(private taskService: TaskService, private router: Router) {}

    onSubmit(): void {
      this.errorMessage = '';
      this.fieldErrors = {};

      this.taskService.createTask({
        title: this.title,
        description: this.description,
        status: this.status,
        due_date: this.due_date
      }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 422) {
            this.fieldErrors = err.error.errors;
          } else {
            this.errorMessage = 'Could not create task. Is the API running?';
          }
        }
      });
    }
  }