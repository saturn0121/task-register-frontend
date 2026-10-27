import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.service';

export interface DashboardStats {
  total: number;
  open: number;
  in_progress: number;
  done: number;
  overdue: number;
  unassigned: number;
  by_priority: { low: number; medium: number; high: number };
  overdue_tasks: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
