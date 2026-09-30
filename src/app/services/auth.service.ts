import { Injectable } from '@angular/core';

// SIMULATED LOGIN ONLY - not real authentication.
// No password, no API call. Replaced with Laravel auth in Week 4.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'demoUser';

  login(name: string): void {
    localStorage.setItem(this.storageKey, name);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  currentUser(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}