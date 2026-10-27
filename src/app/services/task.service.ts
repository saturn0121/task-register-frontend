import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Assignee {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: number | null;
  assignee?: Assignee | null;
  due_date: string | null;
}

// What the form sends to the API (no id, and the assignee object is read-only).
export type TaskPayload = Omit<Task, 'id' | 'assignee'>;

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  overdue?: boolean;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  body: string;
  created_at: string;
  author: Assignee;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8000/api';
  private apiUrl = `${this.baseUrl}/tasks`;

  constructor(private http: HttpClient) { }

  getTasks(filters: TaskFilters = {}): Observable<Task[]> {
    let params = new HttpParams();
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.priority) {
      params = params.set('priority', filters.priority);
    }
    if (filters.assigned_to) {
      params = params.set('assigned_to', filters.assigned_to);
    }
    if (filters.overdue) {
      params = params.set('overdue', '1');
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  createTask(task: TaskPayload): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: number, task: TaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUsers(): Observable<Assignee[]> {
    return this.http.get<Assignee[]>(`${this.baseUrl}/users`);
  }

  getComments(taskId: number): Observable<TaskComment[]> {
    return this.http.get<TaskComment[]>(`${this.apiUrl}/${taskId}/comments`);
  }

  addComment(taskId: number, body: string): Observable<TaskComment> {
    return this.http.post<TaskComment>(`${this.apiUrl}/${taskId}/comments`, { body });
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`);
  }
}
