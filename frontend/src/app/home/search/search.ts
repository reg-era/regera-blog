import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface SearchSuggestion {
  id: string;
  text: string;
  highlightedText?: string;
  type: 'blog' | 'author';
  target: BlogTarget | AuthorTarget;
  aiConfidence?: number; // AI confidence score 0-100
}

export interface BlogTarget {
  id: string;
  title: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  cover: string;
  createdAt: Date;
  tags: string[];
}

export interface AuthorTarget {
  id: string;
  username: string;
  name: string;
  postsCount: number;
  subscribers: number;
  avatar?: string;
  bio?: string;
}

export interface PopularTag {
  name: string;
  count: number;
  trending?: boolean;
}

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class Search {
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;
  @Output() searchResults = new EventEmitter<any[]>();
  @Output() searchQuery = new EventEmitter<string>();

  // Search state
  searchQueryText = '';
  suggestions: SearchSuggestion[] = [];
  showSuggestions = false;
  isSearching = false;
  isProcessingAI = false;
  searchFocused = false;

  // Sample data
  private sampleBlogs: BlogTarget[] = [
    {
      id: '1',
      title: 'Getting Started with Angular',
      author: 'John Doe',
      content: 'Angular is a powerful framework for building dynamic web applications...',
      likes: 245,
      comments: 32,
      cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      createdAt: new Date('2024-01-15'),
      tags: ['Angular', 'TypeScript', 'Web Development']
    },
    {
      id: '2',
      title: 'Mastering TypeScript',
      author: 'Jane Smith',
      content: 'TypeScript brings type safety to JavaScript development...',
      likes: 189,
      comments: 28,
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      createdAt: new Date('2024-02-10'),
      tags: ['TypeScript', 'JavaScript', 'Programming']
    },
    {
      id: '3',
      title: 'Modern CSS Techniques',
      author: 'Mike Johnson',
      content: 'Explore the latest CSS features including Grid, Flexbox...',
      likes: 156,
      comments: 19,
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      createdAt: new Date('2024-02-20'),
      tags: ['CSS', 'Web Design', 'Frontend']
    }
  ];

  private sampleAuthors: AuthorTarget[] = [
    {
      id: '1',
      username: 'johndoe',
      name: 'John Doe',
      postsCount: 15,
      subscribers: 1240,
      bio: 'Full-stack developer passionate about modern web technologies'
    },
    {
      id: '2',
      username: 'janesmith',
      name: 'Jane Smith',
      postsCount: 23,
      subscribers: 890,
      bio: 'TypeScript expert and Angular enthusiast'
    },
    {
      id: '3',
      username: 'johndoe',
      name: 'John Doe',
      postsCount: 15,
      subscribers: 1240,
      bio: 'Full-stack developer passionate about modern web technologies'
    },
    {
      id: '4',
      username: 'janesmith',
      name: 'Jane Smith',
      postsCount: 23,
      subscribers: 890,
      bio: 'TypeScript expert and Angular enthusiast'
    }
  ];

  constructor() { }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQueryText = input.value;

    if (this.searchQueryText.length > 0) {
      this.isSearching = true;
      this.isProcessingAI = true;

      this.suggestions = this.performAISearch(this.searchQueryText);
      this.showSuggestions = true;
      this.isSearching = false;
      this.isProcessingAI = false;
    } else {
      this.clearSearch();
    }
  }

  onSearchFocus(): void {
    this.searchFocused = true;
    if (this.searchQueryText.length > 0) {
      this.showSuggestions = true;
    }
  }

  private performAISearch(query: string): SearchSuggestion[] {
    if (!query || query.length < 2) {
      return [];
    }

    const suggestions: SearchSuggestion[] = [];
    const normalizedQuery = query.toLowerCase();

    // Search in blogs
    this.sampleBlogs.forEach(blog => {
      let confidence = 0;
      if (blog.title.toLowerCase() === normalizedQuery) confidence += 20;

      suggestions.push({
        id: `blog-${blog.id}`,
        text: blog.title,
        highlightedText: this.highlightMatch(blog.title, query),
        type: 'blog',
        target: blog,
        aiConfidence: Math.min(confidence, 100)
      });
    });

    // Search in authors
    this.sampleAuthors.forEach(author => {
      let confidence = 20;
      suggestions.push({
        id: `author-${author.id}`,
        text: author.name,
        highlightedText: this.highlightMatch(author.name, query),
        type: 'author',
        target: author,
        aiConfidence: Math.min(confidence, 100)
      });
    });

    // Sort by confidence
    suggestions.sort((a, b) => (b.aiConfidence || 0) - (a.aiConfidence || 0));

    return suggestions.slice(0, 6);
  }

  private highlightMatch(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  clearSearch(): void {
    this.searchQueryText = '';
    this.suggestions = [];
    this.showSuggestions = false;
    this.isSearching = false;
    this.isProcessingAI = false;
    this.searchFocused = false;

    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }

    this.searchResults.emit([]);
    this.searchQuery.emit('');
  }

}
