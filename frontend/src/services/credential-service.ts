import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';

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

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  constructor(private router: Router, private authService: AuthService) { }

  async RegisterService(form: RegisterFormModel): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/users/register", {
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
      const res = await fetch("http://127.0.0.1:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { token } = await res.json();
        this.authService.register(token);
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
    this.authService.logout();
  }
}
