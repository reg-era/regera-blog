import { Component, OnInit, OnDestroy, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CredentialService } from '../services/credential-service';

import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;

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

    this.initializeTheme();
    this.checkAuthenticationStatus();
  }

  checkAuth() {
    this.credentialService.CheckAuthentication().subscribe(auth => {
      if (auth.valid) {
        this.isBlogger = true;
        this.isAdmin = auth.role == 'ADMIN';
      }
    })
  }

  async logout() {
    await this.credentialService.LogoutService();
    this.isAdmin = false;
    this.isBlogger = false;
  }

  currentUser: any = null;

  // Component destruction subject
  private destroy$ = new Subject<void>();


  ngOnInit(): void {
    // Close navbar on route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeNavBar();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navigation Methods
  toggleNavBar(): void {
    this.showNavBar = !this.showNavBar;

    if (this.showNavBar) {
      this.drawer.open();
    } else {
      this.drawer.close();
    }
  }

  closeNavBar(): void {
    this.showNavBar = false;
    this.drawer.close();
  }

  // Theme Methods
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.currentTheme);
  }

  private initializeTheme(): void {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';

    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }

    this.applyTheme();
  }

  private applyTheme(): void {
    const body = document.body;

    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');

    // Add current theme class
    body.classList.toggle("dark");

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content',
        this.currentTheme === 'light' ? '#ffffff' : '#1e293b'
      );
    }
  }

  // User Methods
  private checkAuthenticationStatus(): void {
    // Replace this with your actual authentication service
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      this.currentUser = JSON.parse(userData);
      this.isBlogger = true;
      this.isAdmin = this.currentUser.role === 'admin';
    } else {
      this.isBlogger = false;
      this.isAdmin = false;
      this.currentUser = null;
    }
  }

  // Handle clicks outside the drawer to close it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const drawer = document.querySelector('.custom-sidenav');
    const toggleButton = document.querySelector('.menu-toggle-fab');

    // Close drawer if clicking outside of it and not on the toggle button
    if (this.showNavBar && drawer && toggleButton) {
      if (!drawer.contains(target) && !toggleButton.contains(target)) {
        this.closeNavBar();
      }
    }
  }

}
