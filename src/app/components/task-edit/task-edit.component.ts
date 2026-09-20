  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TaskService } from '../../services/task.service';

  @Component({
    selector: 'app-task-edit',
    imports: [CommonModule, FormsModule],
    templateUrl: './task-edit.component.html',
    styleUrl: './task-edit.component.css'
  })
  export class TaskEditComponent implements OnInit {
    id!: number;
    title = '';
    description = '';
    status = 'open';
    due_date = '';

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
        next: (task) => {
          this.title = task.title;
          this.description = task.description;
          this.status = task.status;
          this.due_date = task.due_date;
        },
        error: () => {
          this.errorMessage = 'Could not load task. Is the API running?';
        }
      });
    }

    onSubmit(): void {
      this.errorMessage = '';
      this.fieldErrors = {};

      this.taskService.updateTask(this.id, {
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
            this.errorMessage = 'Could not update task. Is the API running?';
          }
        }
      });
    }
  }