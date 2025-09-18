import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CredentialService } from '../services/credential-service';
import { filter } from 'rxjs';

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
  isAdmin = false;
  isBlogger = false;
  currentTheme: 'light' | 'dark' = 'light';
  showNavBar = false;

  constructor(
    public router: Router,
    private credentialService: CredentialService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuth()
      });
  }

  checkAuth() {
    this.credentialService.CheckAuthentication().subscribe(auth => {
      if (auth.valid) {
        this.isBlogger = true;
        this.isAdmin = auth.role == 'ADMIN';
      }
    })
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle("dark")
  }

  async logout() {
    await this.credentialService.LogoutService();
    this.isAdmin = false;
    this.isBlogger = false;
  }
}
