import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskComment } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-comments',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-comments.component.html'
})
export class TaskCommentsComponent implements OnInit {
  @Input() taskId!: number;

  comments: TaskComment[] = [];
  body = '';
  errorMessage = '';
  bodyError = '';
  posting = false;

  constructor(private taskService: TaskService, public authService: AuthService) {}

  ngOnInit(): void {
    this.taskService.getComments(this.taskId).subscribe({
      next: (comments) => (this.comments = comments),
      error: () => (this.errorMessage = 'Could not load comments.')
    });
  }

  canDelete(comment: TaskComment): boolean {
    return this.authService.isAdmin() || comment.user_id === this.authService.currentUser()?.id;
  }

  add(): void {
    this.errorMessage = '';
    const text = this.body.trim();

    if (!text) {
      this.bodyError = 'Write a note before posting.';
      return;
    }
    if (text.length > 1000) {
      this.bodyError = 'Notes must be 1000 characters or fewer.';
      return;
    }
    this.bodyError = '';
    this.posting = true;

    this.taskService.addComment(this.taskId, text).subscribe({
      next: (comment) => {
        this.comments = [...this.comments, comment];
        this.body = '';
        this.posting = false;
      },
      error: (err) => {
        this.posting = false;
        if (err.status === 422) {
          this.bodyError = err.error.errors?.['body']?.[0] ?? 'That note is not valid.';
        } else {
          this.errorMessage = 'Could not post the note. Is the API running?';
        }
      }
    });
  }

  remove(comment: TaskComment): void {
    this.errorMessage = '';

    this.taskService.deleteComment(comment.id).subscribe({
      next: () => (this.comments = this.comments.filter(c => c.id !== comment.id)),
      error: (err) => {
        this.errorMessage = err.status === 403
          ? 'You can only delete your own notes.'
          : 'Could not delete the note.';
      }
    });
  }
}
