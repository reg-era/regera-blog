import { Component } from '@angular/core';
import { BlogCard } from './blog-card/blog-card';
import { Search } from './search/search';
import { BlogObject, BlogService } from '../../services/blog-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, BlogCard, Search, MatProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public blogs$: Observable<BlogObject[] | null>;

  constructor(private blogService: BlogService) {
    this.blogs$ = this.blogService.getHomeBlogs();
  }
}
