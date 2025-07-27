import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    // Check localStorage or cookies for persisted login
    const storedToken ="sdf" //localStorage.getItem('auth_token');
    this.isLoggedInSubject.next(!!storedToken);
  }

  // Observable for components to subscribe to
  get isAuthenticated$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Optional: current value
  get isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  login(token: string) {
    localStorage.setItem('auth_token', token);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false);
  }
}
