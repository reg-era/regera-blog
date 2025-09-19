import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
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

  async RegisterService(form: RegisterFormModel): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${environment.apiURL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('auth_token', token);
        this.router.navigate(['/']);
        return { success: true };
      } else {
        const { error } = await res.json();
        return { success: false, message: error };
      }

    } catch (error) {
      console.error("Error: ", error);
      return { success: false, message: 'Sorry something is wrong' };
    }
  }

  async LoginService(form: LoginFormModel): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${environment.apiURL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("auth_token", token);
        this.router.navigate(['/']);
        return { success: true };
      } else {
        const { error } = await res.json();
        return { success: false, message: error };
      }
    } catch (error) {
      console.error("Error: ", error);
      return { success: false, message: 'Sorry something is wrong' };
    }
  }

  async LogoutService() {
    localStorage.removeItem("auth_token");
    this.router.navigate(['/login']);
  }

  CheckAuthentication(): Observable<{ valid: boolean, username: string, role: string }> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return of({ valid: false, username: '', role: '' }); // return an Observable of default
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<{ username: string, role: string }>(
      `${environment.apiURL}/api/users/ping`,
      { headers }
    ).pipe(
      map(data => ({ valid: true, ...data })), // map response to desired format
      catchError(() => of({ valid: false, username: '', role: '' })) // handle error
    );
  }
}
