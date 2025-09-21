import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlogCard } from './blog-card/blog-card';
import { Search } from './search/search';
import { BlogObject, BlogService } from '../../services/blog-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [BlogCard, Search, MatProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {
  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef<HTMLElement>;

  blogs: BlogObject[] = [];

  private duplicatedBlogs: BlogObject[] = [];
  _Refresh = true;

  constructor(private cdr: ChangeDetectorRef, private blogService: BlogService) {
  }

  ngAfterViewInit(): void {
    
    this.setupInfiniteScroll();
  }

  async ngOnInit() {
    const response = await this.blogService.getHomeBlogs();
    if (response.success) {
      this.blogs = response.data;
      this._Refresh = false;
      this.cdr.markForCheck();
    }
  }

  private setupInfiniteScroll(): void {
    if (!this.carouselTrack?.nativeElement || this.blogs.length === 0) {
      return;
    }

    // Create duplicated blogs for seamless infinite scroll
    this.duplicatedBlogs = [...this.blogs, ...this.blogs];

    // Calculate total width needed for smooth animation
    const cardWidth = 350; // Width of each card
    const gap = 32; // Gap between cards (2rem = 32px)
    const totalWidth = this.blogs.length * (cardWidth + gap);

    // Set CSS custom property for animation
    const track = this.carouselTrack.nativeElement;
    track.style.setProperty('--scroll-width', `${totalWidth}px`);

    // Pause animation on hover
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  // Method to get duplicated blogs for template
  getDuplicatedBlogs(): any[] {
    return this.duplicatedBlogs.length > 0 ? this.duplicatedBlogs : this.blogs;
  }
}