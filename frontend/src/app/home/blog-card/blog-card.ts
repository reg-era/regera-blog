import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export interface Blog {
  id: number;
  title: string;
  author: string;
  cover: string;
  blog: string;
  likes: number;
  comments: number;
  publishDate: Date;
  tags?: string[];
}

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
  styleUrl: './blog-card.css'
})
export class BlogCard {
  @Input() blog!: Blog;

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

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
