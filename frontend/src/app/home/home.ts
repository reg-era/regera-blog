import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BlogCard } from './blog-card/blog-card';
import { Search } from './search/search';
import { BlogObject, BlogService } from '../../services/blog-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, BlogCard, Search, MatProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  public blogs$: Observable<BlogObject[] | null>;

  constructor(private blogService: BlogService) {
    this.blogs$ = this.blogService.getHomeBlogs();
  }

  ngOnInit(): void {
    window.addEventListener('click', this.onScroll);
  }

  onScroll(event: any) {
    console.log('wwiwiwiwi');
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      console.log('wwiwiwiwi');
      ;
    }
  }
}
