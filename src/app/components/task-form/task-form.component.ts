import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Input() task: Omit<Task, 'id'> = {
    title: '',
    description: '',
    status: 'open',
    due_date: ''
  };
  @Input() fieldErrors: { [key: string]: string[] } = {};
  @Input() submitLabel = 'Save';

  @Output() save = new EventEmitter<Omit<Task, 'id'>>();

  onSubmit(): void {
    this.save.emit(this.task);
  }
}