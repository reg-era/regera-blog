import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { BlogObject, BlogService } from '../../../services/blog-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule
  ],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss'
})
export class BlogCardComponent {
  @Input() blog!: BlogObject;
  isOwner: boolean = false;
  showDialog: boolean = false;

  constructor(private router: Router, private blogService: BlogService) {
    if (this.router.url == '/profile') this.isOwner = true;
  }

  goBlog(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.cancel-btn') || target.closest('.confirm-btn') || target.closest('.edit-btn') || target.closest('.delete-btn')) {
      return;
    }

    this.router.navigate([`/blog/${this.blog.id}`])
  }

  getAuthorInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  formatCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  onEdit() {
    localStorage.setItem(`blog-${this.blog.id}`, JSON.stringify(this.blog))
    this.router.navigate([`/newblog/${this.blog.id}`])
  }

  onConfirmDelet() {
    this.blogService.deletBlog(this.blog.id)
  }
}
