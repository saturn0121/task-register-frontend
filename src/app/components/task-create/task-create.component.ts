import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService, TaskPayload, Assignee } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent implements OnInit {
  task: TaskPayload = {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assigned_to: null,
    due_date: ''
  };

  users: Assignee[] = [];
  errorMessage = '';
  fieldErrors: { [key: string]: string[] } = {};

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: () => (this.errorMessage = 'Could not load the user list for assigning.')
    });
  }

  onSave(data: TaskPayload): void {
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
