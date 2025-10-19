import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from '../environments/environment.development';

export interface RegisterFormModel {
  username: string | any;
  email: string | any;
  bio: string | any;
  password: string | any;
  confirmPassword: string | any;
}

export interface LoginFormModel {
  username: string | any,
  email: string | any,
  password: string | any,
}

@Injectable({ providedIn: 'root' })
export class CredentialService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  RegisterService(form: RegisterFormModel): Observable<string | null> {
    return this.http.post<{ token: string } | { error: string }>(
      `${environment.apiURL}/api/users/register`,
      form
    ).pipe(
      tap((res: any) => {
        if ('token' in res) {
          localStorage.setItem('auth_token', res.token);
          this.router.navigate(['/']);
        }
      }),
      map((res: any) => {
        if ('token' in res) {
          return null;
        }
        return res.error; // backend error
      }),
      catchError((err) => of(err.error.error))
    );
  }

  LoginService(form: LoginFormModel): Observable<string | null> {
    return this.http.post<{ token: string } | { error: string }>(
      `${environment.apiURL}/api/users/login`,
      form
    ).pipe(
      tap((res: any) => {
        if ('token' in res) {
          localStorage.setItem('auth_token', res.token);
          this.router.navigate(['/']);
        }
      }),
      map((res: any) => {
        if ('token' in res) {
          return null;
        }
        return res.error;
      }),
      catchError((err) => {
        const error = err.error.error || 'Sorry something is wrong';
        return of(error);
      })
    );
  }

  LogoutService() {
    localStorage.removeItem("auth_token");
    this.router.navigate(['/login']);
  }

  CheckAuthentication(): Observable<{ username: string, role: string } | null> {
    const token = localStorage.getItem('auth_token');
    if (!token || token === '') {
      return of(null);
    }

    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<{ username: string, role: string }>(
      `${environment.apiURL}/api/users/ping`,
      { headers, observe: 'response' }
    ).pipe(
      map((resp: HttpResponse<{ username: string, role: string }>) => {
        const newToken = resp.headers.get('Authorization');
        if (newToken && newToken.startsWith('Bearer ')) {
          localStorage.setItem('auth_token', newToken.substring('Bearer '.length));
        }

        return resp.body;
      }),
      catchError(() => {
        localStorage.removeItem('auth_token');
        return of(null);
      })
    );
  }
}
