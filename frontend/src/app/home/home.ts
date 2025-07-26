import { Component } from '@angular/core';
import { BlogCarouselComponent, Blog } from './block/block';
import { Search } from './search/search';
import { MatIcon } from '@angular/material/icon';

export interface SearchSuggestion {
  type: 'title' | 'author' | 'content' | 'tag';
  text: string;
  blog: Blog;
  highlightedText?: string;
}

@Component({
  selector: 'app-home',
  imports: [BlogCarouselComponent, Search, MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  currentSearchQuery = '';
  displayedBlogs: Blog[] = [];

  blogs: Blog[] = [
    {
      id: 1,
      title: "The Future of Web Design: Trends to Watch in 2024",
      author: "Sarah Johnson",
      cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      blog: "Exploring the latest trends and technologies that are shaping the future of web design and user experience. From AI-powered design tools to immersive 3D interfaces, discover what's coming next in the world of digital design.",
      likes: 234,
      comments: 18,
      publishDate: new Date('2024-01-15'),
      readTime: 5
    },
    {
      id: 2,
      title: "Mastering CSS Grid Layout: A Complete Guide",
      author: "Mike Chen",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      blog: "A comprehensive guide to understanding and implementing CSS Grid for modern web layouts. Learn advanced techniques, best practices, and real-world examples that will transform your frontend development skills.",
      likes: 189,
      comments: 25,
      publishDate: new Date('2024-01-12'),
      readTime: 8
    },
    {
      id: 3,
      title: "JavaScript ES2024 Features You Should Know",
      author: "Emily Rodriguez",
      cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
      blog: "Discover the newest JavaScript features that will revolutionize how we write code in 2024. From pattern matching to pipeline operators, explore the cutting-edge additions to the JavaScript ecosystem.",
      likes: 342,
      comments: 41,
      publishDate: new Date('2024-01-10'),
      readTime: 6
    },
    {
      id: 4,
      title: "UX Psychology: Understanding User Behavior",
      author: "David Kim",
      cover: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop",
      blog: "Understanding the psychological principles that drive user behavior and improve user experience. Dive deep into cognitive biases, decision-making processes, and how to design interfaces that truly resonate with users.",
      likes: 156,
      comments: 12,
      publishDate: new Date('2024-01-08'),
      readTime: 7
    },
    {
      id: 5,
      title: "Mobile-First Design: Strategy and Implementation",
      author: "Lisa Park",
      cover: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      blog: "Why mobile-first design is crucial for modern websites and how to implement it effectively. Learn responsive design patterns, performance optimization techniques, and accessibility considerations for mobile users.",
      likes: 278,
      comments: 33,
      publishDate: new Date('2024-01-05'),
      readTime: 4
    },
    {
      id: 6,
      title: "AI in Web Development: Tools and Opportunities",
      author: "Alex Thompson",
      cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      blog: "How artificial intelligence is transforming web development and what it means for developers. Explore AI-powered coding assistants, automated testing tools, and the future of intelligent web applications.",
      likes: 445,
      comments: 67,
      publishDate: new Date('2024-01-03'),
      readTime: 9
    }
  ];
  constructor() {
    // Initialize with all blogs
    this.displayedBlogs = [...this.blogs];
  }

  onBlogsFiltered(filteredBlogs: Blog[]) {
    this.displayedBlogs = filteredBlogs;
  }

  onSearchQueryChange(query: string) {
    this.currentSearchQuery = query;
  }

  clearSearch() {
    this.currentSearchQuery = '';
    this.displayedBlogs = [...this.blogs];
    // You can also emit an event to clear the search component's input
    // or use ViewChild to access the search component directly
  }
}