import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

export interface Blog {
  id: number;
  title: string;
  author: string;
  cover: string;
  blog: string;
  likes: number;
  comments: number;
  publishDate?: Date;
  tags?: string[];
}

export interface Bloger {
  id: string;
  username: string;
  subscribers: number;
  blogs: number;
}

export interface SearchSuggestion {
  id: number;
  text: string;
  target: Blog | Bloger;
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
export class Search {
  test: SearchSuggestion[] = [
    {
      id: 1,
      text: 'Mastering TypeScript Types',
      target: {
        id: 3,
        title: 'Mastering TypeScript Types',
        author: 'Charlie',
        cover: '/covers/3.jpg',
        blog: 'TypeScript types help avoid bugs...',
        likes: 220,
        comments: 48,
        tags: ['TypeScript', 'Types', 'Best Practices']
      }
    },
    {
      id: 2,
      text: 'dev_guru',
      target: {
        id: 'u1',
        username: 'dev_guru',
        subscribers: 1200,
        blogs: 24
      }
    },
    {
      id: 3,
      text: 'Signals',
      target: {
        id: 1,
        title: 'Understanding Angular Signals',
        author: 'Alice',
        cover: '/covers/1.jpg',
        blog: 'Angular signals simplify reactivity...',
        likes: 120,
        comments: 34,
        publishDate: new Date('2024-05-12'),
        tags: ['Angular', 'Signals', 'Reactivity']
      }
    },
    {
      id: 4,
      text: 'CSS',
      target: {
        id: 2,
        title: 'Bootstrap Tips for UI Polish',
        author: 'Bob',
        cover: '/covers/2.jpg',
        blog: 'Bootstrap 5 brings new utility classes...',
        likes: 80,
        comments: 20,
        publishDate: new Date('2024-06-20'),
        tags: ['Bootstrap', 'UI', 'CSS']
      }
    },
    {
      id: 5,
      text: 'Charlie',
      target: {
        id: 3,
        title: 'Mastering TypeScript Types',
        author: 'Charlie',
        cover: '/covers/3.jpg',
        blog: 'TypeScript types help avoid bugs...',
        likes: 220,
        comments: 48,
        tags: ['TypeScript', 'Types', 'Best Practices']
      }
    },
    {
      id: 6,
      text: 'frontendqueen',
      target: {
        id: 'u2',
        username: 'frontendqueen',
        subscribers: 980,
        blogs: 18
      }
    },
  ];

  searchQuery = '';
  suggestions: SearchSuggestion[] = [];
  showSuggestions = false;

  onSearchInput(event: any) {
    if (event.target.value.length == 0) {
      this.clearSearch();
      return;
    }
    this.searchQuery = event.target.value;

    this.suggestions = this.test.map((item) => {
      item.highlightedText = this.highlightText(item.text);
      return item;
    });
    this.showSuggestions = true;
  }

  highlightText(text: string): string {
    if (!this.searchQuery) return text;

    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    console.log("go to", suggestion.text);
  }

  clearSearch() {
    this.searchQuery = '';
    this.suggestions = [];
    this.showSuggestions = false;
  }
}