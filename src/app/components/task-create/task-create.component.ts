import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent {
  task: Omit<Task, 'id'> = {
    title: '',
    description: '',
    status: 'open',
    due_date: ''
  };

  errorMessage = '';
  fieldErrors: { [key: string]: string[] } = {};

  constructor(private taskService: TaskService, private router: Router) {}

  onSave(data: Omit<Task, 'id'>): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    this.taskService.createTask(data).subscribe({
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
