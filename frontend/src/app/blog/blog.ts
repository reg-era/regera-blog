import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogObject, BlogService, createEmptyBlogObject } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog',
  imports: [MatProgressSpinner, MatCardModule, MatIconModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})

export class Blog implements OnInit {
  blog: BlogObject = createEmptyBlogObject();

  _Refresh = true;
  newComment = '';

  constructor(private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, private blogService: BlogService) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      this.router.navigate(['/']);
      return;
    }

    this.blog = (await this.blogService.getBlog(parsedId)).data;
    this._Refresh = false;

    this.cdr.markForCheck();
  }

  toggleLike() {
    this.blog.isLiking = !this.blog.isLiking;
  }

  setComment(e: KeyboardEvent) {
    const input = e.target as HTMLTextAreaElement;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.submitComment();
    } else {
      this.newComment = input.value;
    }
  }

  submitComment() {
    if (!this.newComment.trim()) return;
    // this.blog.commentsArr.push({ id: this.blog.commentsArr.length, user: 'Guest', text: this.newComment });
    this.newComment = '';
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date == '' ? new Date() : new Date(date));
  }
}
