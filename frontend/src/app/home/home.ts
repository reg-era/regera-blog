import { Component, OnInit } from '@angular/core';
import { BlogCard } from './blog-card/blog-card';
import { Search } from './search/search';
import { BlogObject, BlogService } from '../../services/blog-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    BlogCard,
    Search,
    MatProgressSpinner
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  public blogs$ = new BehaviorSubject<BlogObject[]>([]);

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getHomeBlogs().subscribe({
      next: (blogs) => {
        if (blogs) {
          this.blogs$.next(blogs);
        }
      },
      error: (err) => console.error('Error loading blogs:', err),
    });
  }
}
