import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogObject, BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommentObject, UserService } from '../../services/user-service';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MediaService } from '../../services/media-service';

@Component({
  selector: 'app-blog',
  imports: [
    AsyncPipe,
    MatProgressSpinner,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})

export class Blog implements OnInit {
  public blog$: BehaviorSubject<BlogObject | null>;
  public comments$: BehaviorSubject<CommentObject[] | null>;

  public blogMedia$: BehaviorSubject<string>;
  public IsVideo = false;

  public CommentFrom: FormGroup;
  private commentPage = 0;
  public doneComment = false;

  private md: MarkdownIt;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private userService: UserService,
    private mediaService: MediaService,
    private fb: FormBuilder
  ) {
    this.blog$ = new BehaviorSubject<BlogObject | null>(null);
    this.comments$ = new BehaviorSubject<CommentObject[] | null>(null);
    this.blogMedia$ = new BehaviorSubject<string>('/error-media.gif');

    this.md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      highlight: (code: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
        }
        return `<pre><code class="hljs">${this.md.utils.escapeHtml(code)}</code></pre>`;
      },
    });

    this.CommentFrom = this.fb.group({ comment: ['', Validators.max(150)] })
  }

  ngOnInit() {
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

    this.blogService.getBlog(parsedId).subscribe((blog) => {
      if (blog) {
        this.blog$.next(blog);
        this.IsVideo = blog.media.includes('video');

        this.mediaService.urlToBlobImageUrl(blog.media).subscribe((url) => {
          this.blogMedia$.next(url);
        })
      }
    });
    this.blogService.getComments(parsedId, this.commentPage++).subscribe((comments) => {
      this.comments$.next(comments);
    });
  }

  toggleLike() {
    if (this.blog$.value) {
      this.userService.makeLike(this.blog$.value.id).subscribe((res) => {
        if (res) {
          this.blog$.next({
            ...this.blog$.value!,
            likes: res.likes,
            isLiking: res.status == 1
          })
        }
      });
    }
  }

  submitComment() {
    if (this.CommentFrom.valid) {

      const newComment: string = this.CommentFrom.get('comment')?.getRawValue();
      if (this.blog$.value && newComment && newComment.length > 0) {
        this.userService.makeComment(this.blog$.value.id, newComment).subscribe((comment) => {
          if (this.comments$.value && comment) {
            this.comments$.next([
              comment,
              ...this.comments$.value
            ]);
          }
          this.CommentFrom.reset();
          this.CommentFrom.markAsPristine();
          this.CommentFrom.markAsUntouched();
          this.CommentFrom.updateValueAndValidity();
        })
      }
    }
  }

  getMoreComment() {
    if (!this.doneComment && this.blog$.value) {
      this.blogService.getComments(this.blog$.value.id, this.commentPage++).subscribe((comments) => {
        if (comments) {
          this.comments$.next([...this.comments$.value!, ...comments]);
          if (comments.length < 5) {
            this.doneComment = true;
          }
        }
      });
    }
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
