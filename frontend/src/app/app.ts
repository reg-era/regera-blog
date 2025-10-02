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

  isAdmin = false;
  isBlogger = false;
  currentTheme: 'light' | 'dark' = 'light';
  showNavBar = false;

  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    private credentialService: CredentialService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuth()
      });

    this.currentTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeNavBar();
      });

    this.applyTheme();
  }

  checkAuth() {
    this.credentialService.CheckAuthentication().subscribe(auth => {
      if (auth.valid) {
        this.isBlogger = true;
        this.isAdmin = auth.role == 'ADMIN';
      }
    })
  }

  logout() {
    this.credentialService.LogoutService();
    this.isAdmin = false;
    this.isBlogger = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }

  private applyTheme(): void {
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme !== 'light' && savedTheme !== 'dark') savedTheme = null;

    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }

    this.currentTheme == 'light' ? document.body.classList.remove("dark") : document.body.classList.add("dark");
    localStorage.setItem('theme', this.currentTheme);
  }

}
