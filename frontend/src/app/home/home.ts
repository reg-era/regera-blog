import { Component, OnInit } from '@angular/core';
import { BlogCardComponent } from './blog-card/blog-card';
import { SearchComponent } from './search/search';
import { BlogObject, BlogService } from '../../services/blog-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    BlogCardComponent,
    SearchComponent,
    MatProgressSpinner
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  public blogs$ = new BehaviorSubject<BlogObject[]>([]);
  public blogSize = 0;
  maxArray = [...Array(200).keys()].map(i => i + 1);

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getHomeBlogs().subscribe({
      next: (blogs) => {
        if (blogs) {
          this.blogSize = blogs.length;
          this.blogs$.next(blogs);
        }
      },
      error: (err) => console.error('Error loading blogs:', err),
    });
  }
}
