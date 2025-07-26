import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
// import { Blog } from '../../blog/blog';
export interface Blog {
  id: number;
  title: string;
  author: string;
  cover: string;
  blog: string;
  likes: number;
  comments: number;
  publishDate?: Date;
  readTime?: number;
  tags?: string[];
}


export interface SearchSuggestion {
  type: 'title' | 'author' | 'content' | 'tag';
  text: string;
  blog: Blog;
  highlightedText?: string;
}

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search implements OnInit, OnDestroy {
  @Input() blogs: Blog[] = [];
  @Output() blogsFiltered = new EventEmitter<Blog[]>();
  @Output() searchQueryChange = new EventEmitter<string>();

  searchQuery = '';
  suggestions: SearchSuggestion[] = [];
  showSuggestions = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Debounce search input to avoid too many API calls
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchSubject.next(query);
    this.searchQueryChange.emit(query);
  }

  onSearchFocus() {
    if (this.searchQuery && this.searchQuery.length > 0) {
      this.showSuggestions = true;
    }
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  performSearch(query: string) {
    if (!query || query.length < 2) {
      this.suggestions = [];
      this.showSuggestions = false;
      this.blogsFiltered.emit(this.blogs); // Show all blogs
      return;
    }

    this.suggestions = this.generateSuggestions(query);
    this.showSuggestions = true;

    // Filter blogs based on search
    const filteredBlogs = this.filterBlogs(query);
    this.blogsFiltered.emit(filteredBlogs);
  }

  generateSuggestions(query: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    const maxSuggestions = 5;

    this.blogs.forEach(blog => {
      // Title suggestions
      if (blog.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'title',
          text: blog.title,
          blog: blog,
          highlightedText: this.highlightText(blog.title, query)
        });
      }

      // Author suggestions
      if (blog.author.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'author',
          text: blog.author,
          blog: blog,
          highlightedText: this.highlightText(blog.author, query)
        });
      }

      // Content suggestions
      if (blog.blog.toLowerCase().includes(queryLower)) {
        const excerpt = this.getExcerptWithQuery(blog.blog, query);
        suggestions.push({
          type: 'content',
          text: excerpt,
          blog: blog,
          highlightedText: this.highlightText(excerpt, query)
        });
      }

      // Tag suggestions (if tags exist)
      if (blog.tags) {
        blog.tags.forEach(tag => {
          if (tag.toLowerCase().includes(queryLower)) {
            suggestions.push({
              type: 'tag',
              text: tag,
              blog: blog,
              highlightedText: this.highlightText(tag, query)
            });
          }
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) =>
        index === self.findIndex(s =>
          s.blog.id === suggestion.blog.id && s.type === suggestion.type
        )
      )
      .slice(0, maxSuggestions);

    return uniqueSuggestions;
  }

  highlightText(text: string, query: string): string {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  getExcerptWithQuery(content: string, query: string): string {
    const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
    if (queryIndex === -1) return content.substring(0, 100) + '...';

    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + query.length + 50);

    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }

  filterBlogs(query: string): Blog[] {
    const queryLower = query.toLowerCase();

    return this.blogs.filter(blog =>
      blog.title.toLowerCase().includes(queryLower) ||
      blog.author.toLowerCase().includes(queryLower) ||
      blog.blog.toLowerCase().includes(queryLower) ||
      (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(queryLower)))
    );
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    this.searchQuery = suggestion.text;
    this.showSuggestions = false;
    this.performSearch(this.searchQuery);
    this.searchQueryChange.emit(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.suggestions = [];
    this.showSuggestions = false;
    this.blogsFiltered.emit(this.blogs);
    this.searchQueryChange.emit('');
  }

  getAuthorPostCount(author: string): number {
    return this.blogs.filter(blog => blog.author === author).length;
  }
}