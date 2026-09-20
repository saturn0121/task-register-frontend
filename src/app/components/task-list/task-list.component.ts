  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { TaskService, Task } from '../../services/task.service';

  @Component({
    selector: 'app-task-list',
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
  })
  export class TaskListComponent implements OnInit {
    tasks: Task[] = [];
    errorMessage = '';

    search = '';
    status = '';

    constructor(private taskService: TaskService) {}

    ngOnInit(): void {
      this.loadTasks();
    }

    loadTasks(): void {
      this.errorMessage = '';

      this.taskService.getTasks(this.search, this.status).subscribe({
        next: (data) => {
          this.tasks = data;
        },
        error: (err) => {
          console.error('Failed to load tasks', err);
          this.errorMessage = 'Could not load tasks. Is the API running?';
        }
      });
    }
  }