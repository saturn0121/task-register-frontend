import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, Assignee } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  users: Assignee[] = [];
  errorMessage = '';
  loading = false;

  search = '';
  status = '';
  priority = '';
  assignedTo = '';
  overdueOnly = false;

  confirmingId: number | null = null;
  deletingId: number | null = null;

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // The dashboard links here with filters in the query string (e.g. ?status=open).
    const q = this.route.snapshot.queryParamMap;
    this.search = q.get('search') ?? '';
    this.status = q.get('status') ?? '';
    this.priority = q.get('priority') ?? '';
    this.assignedTo = q.get('assigned_to') ?? '';
    this.overdueOnly = q.get('overdue') === '1';

    this.taskService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error('Failed to load users', err)
    });

    this.loadTasks();
  }

  loadTasks(): void {
    this.errorMessage = '';
    this.loading = true;

    this.taskService.getTasks({
      search: this.search,
      status: this.status,
      priority: this.priority,
      assigned_to: this.assignedTo,
      overdue: this.overdueOnly
    }).subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.loading = false;
        this.errorMessage = 'Could not load tasks. Is the API running?';
      }
    });
  }

  clearFilters(): void {
    this.search = '';
    this.status = '';
    this.priority = '';
    this.assignedTo = '';
    this.overdueOnly = false;
    this.loadTasks();
  }

  get hasFilters(): boolean {
    return !!(this.search || this.status || this.priority || this.assignedTo || this.overdueOnly);
  }

  isOverdue(task: Task): boolean {
    if (!task.due_date || task.status === 'done') {
      return false;
    }
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return task.due_date < today;
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-yellow-100 text-yellow-800';
    }
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
        } else if (err.status === 403) {
          this.errorMessage = 'You do not have permission to delete tasks.';
        } else {
          this.errorMessage = 'Could not delete the task. Is the API running?';
        }
      }
    });
  }
}
