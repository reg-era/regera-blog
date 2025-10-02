import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogObject, BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommentObject, UserService } from '../../services/user-service';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-blog',
  imports: [MatProgressSpinner, MatCardModule, MatIconModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})

export class Blog implements OnInit {
  blog!: BlogObject;
  comments: CommentObject[] = [];

  _Refresh = true;
  newComment = '';

  private md: MarkdownIt;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private userService: UserService
  ) {
    this.md = new MarkdownIt({
      html: false,       // disable raw HTML in markdown for security
      linkify: true,     // autolink URLs
      typographer: true, // nice quotes, dashes
      highlight: (code: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
        }
        return `<pre><code class="hljs">${this.md.utils.escapeHtml(code)}</code></pre>`;
      },
    });
  }

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

    const resBlog = await this.blogService.getBlog(parsedId);
    const resComm = await this.blogService.getComments(parsedId, 0);
    if (resBlog) {
      this.blog = resBlog;
    }

    this.comments = resComm.comment;
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

  public toHtml(markdown: string): string {
    const rawHtml = this.md.render(markdown || '');
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['figure', 'figcaption', 'details', 'summary'],
      ADD_ATTR: ['target', 'rel']
    });
  }
}
