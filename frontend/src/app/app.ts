import { Component, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');


  constructor(public router: Router) { }

  getNavigation(): Map<string, string> {
    const res = new Map<string, string>();
    const currentUrl = this.router.url;

    const isAuthenticated = this.isAuthenticated();
    const isAdmin = this.isAdmin();

    if (isAuthenticated) {
      if (currentUrl !== '/newblog') {
        res.set('/newblog', 'New Blog');
      }
      if (currentUrl !== '/profile') {
        res.set('/profile', 'Profile');
      }
      if (isAdmin) {
        res.set('/admin', 'Dashboard');
      }
      return res;
    }

    switch (currentUrl) {
      case '/login':
        res.set('/register', 'Register');
        break;
      case '/register':
        res.set('/login', 'Login');
        break;
      default:
        res.set('/login', 'Login');
        res.set('/register', 'Register');
        break;
    }

    return res;
  }

  isAdmin(): boolean {
    return false;
  }
  isAuthenticated(): boolean {
    return true;
  }
}
