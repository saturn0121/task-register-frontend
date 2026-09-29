import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-edit',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css'
})
export class TaskEditComponent implements OnInit {
  id!: number;
  task: Omit<Task, 'id'> | null = null;

  errorMessage = '';
  fieldErrors: { [key: string]: string[] } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.taskService.getTask(this.id).subscribe({
      next: (data) => {
        this.task = {
          title: data.title,
          description: data.description,
          status: data.status,
          due_date: data.due_date
        };
      },
      error: () => {
        this.errorMessage = 'Could not load task. Is the API running?';
      }
    });
  }

  onSave(data: Omit<Task, 'id'>): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    this.taskService.updateTask(this.id, data).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 422) {
          this.fieldErrors = err.error.errors;
        } else {
          this.errorMessage = 'Could not update task. Is the API running?';
        }
      }
    });
  }
}