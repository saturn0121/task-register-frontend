  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  import { TaskService, Task } from '../../services/task.service';

  @Component({
    selector: 'app-task-list',
    imports: [CommonModule, RouterLink],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
  })
  
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
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