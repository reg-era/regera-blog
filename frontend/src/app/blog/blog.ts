import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogObject, BlogService, createEmptyBlogObject } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommentObject, UserService } from '../../services/user-service';

@Component({
  selector: 'app-blog',
  imports: [MatProgressSpinner, MatCardModule, MatIconModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})

export class Blog implements OnInit {
  blog: BlogObject = createEmptyBlogObject();
  comments: CommentObject[] = [];

  _Refresh = true;
  newComment = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private userService: UserService
  ) { }

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
    this.comments = (await this.blogService.getComments(parsedId, 0)).comment;
    this._Refresh = false;

    this.cdr.markForCheck();
  }

  async toggleLike() {
    const response = await this.userService.makeLike(this.blog.id);
    if (response.success) {
      this.blog.isLiking = response.data.status == 1;
      this.blog.likes = response.data.likes;
    }
    this.cdr.markForCheck();
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

  async submitComment() {
    if (!this.newComment.trim()) return;
    const comment = await this.userService.makeComment(this.blog.id, this.newComment.trim());
    if (comment.success) {
      this.comments.push(comment.comment);
    }
    this.newComment = '';
    this.cdr.markForCheck();
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date == '' ? new Date() : new Date(date));
  }
}
