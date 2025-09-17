import { afterNextRender, DOCUMENT, Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$().pipe(
      tap(isAuth => {
        if (!isAuth) this.router.navigate(['/login']);
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    this.checkAuth();
  }

  register(token: string) {
    localStorage.setItem("auth_token", token);
    this.authStatus.next(true);
  }

  logout() {
    localStorage.removeItem("auth_token");
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  isAuthenticated(): boolean {
    return this.authStatus.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  checkAuth() {
    afterNextRender(async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        this.authStatus.next(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8080/api/users/ping", {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.authStatus.next(res.ok);
      } catch {
        this.authStatus.next(false);
      }
    });
  }
}

