import { Component, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';

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
    Navbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  currentTheme: 'light' | 'dark' = 'light';
  showNavBar = false;

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle("dark")
  }
}
