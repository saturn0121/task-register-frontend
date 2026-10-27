import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.errorMessage = '';
    this.dashboardService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: () => (this.errorMessage = 'Could not load the dashboard. Is the API running?')
    });
  }

  // Width of a bar as a percentage of all tasks (0 when there are none).
  percent(count: number): number {
    return this.stats && this.stats.total > 0 ? Math.round((count / this.stats.total) * 100) : 0;
  }
}
