import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BlogCard } from './blog-card/blog-card';
import { Search } from './search/search';
import { BlogObject, BlogService } from '../../services/blog-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [BlogCard, Search, MatProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  blogs: BlogObject[] = [];
  _Refresh = true;

  constructor(private cdr: ChangeDetectorRef, private blogService: BlogService) {
  }

  async ngOnInit() {
    const response = await this.blogService.getHomeBlogs();
    if (response.success) {
      this.blogs = response.data;
      this._Refresh = false;
      this.cdr.markForCheck();
    }
  }
}