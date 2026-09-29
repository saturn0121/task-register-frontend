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

    confirmingId: number | null = null;
    deletingId: number | null = null;

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

    askDelete(id: number): void {
      this.confirmingId = id;
    }

    cancelDelete(): void {
      this.confirmingId = null;
    }

    confirmDelete(id: number): void {
      this.errorMessage = '';
      this.deletingId = id;

      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== id);
          this.confirmingId = null;
          this.deletingId = null;
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          this.deletingId = null;
          this.confirmingId = null;

          if (err.status === 404) {
            this.loadTasks();
            this.errorMessage = 'That task no longer exists. The list has been refreshed.';
          } else {
            this.errorMessage = 'Could not delete the task. Is the API running?';
          }
        }
      });
    }
      
  }