import { Component, signal } from '@angular/core';
import { BlogCard } from '../home/blog-card/blog-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

export interface Blog {
  id: number;
  title: string;
  author: string;
  cover: string;
  blog: string;
  likes: number;
  comments: number;
  publishDate: Date;
  tags?: string[];
}
@Component({
  selector: 'app-bloger',
  imports: [FormsModule, BlogCard, MatCardModule, MatIconModule, MatFormFieldModule, MatListModule],
  templateUrl: './bloger.html',
  styleUrl: './bloger.css'
})

export class Bloger {
  blogger = {
    name: 'Jane Dev',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    bio: 'Frontend engineer & tech blogger who loves Angular and design systems.',
    registeredAt: new Date('2023-02-15'),
    followers: 243,
    blogs: this.getBlogs(),
  };

  availableReasons = [
    'Spam or misleading',
    'Harassment or hate speech',
    'Inappropriate content',
    'Fake identity',
    'Other'
  ];

  isFollowing = false;
  selectedReasons: string[] = [];
  reportMessage: string = '';
  reportDetails: string = '';
  showReport = false;
  showToast = signal(false);
  toastMessage = signal<string>('');

  toggleReason(reason: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedReasons.push(reason);
    } else {
      this.selectedReasons = this.selectedReasons.filter(r => r !== reason);
    }
  }

  confirmReport(): void {
    const reportPayload = {
      reasons: this.selectedReasons,
      message: this.reportMessage
    };

    console.log('Submitting Report:', reportPayload);
    this.displayToast(true);
  }

  displayToast(sucess: boolean) {
    this.showReport = false;

    this.showToast.set(true);
    this.toastMessage.set(sucess ? 'Reporting profile' : 'Faile reporting profile');

    setTimeout(() => {
      this.showToast.set(false);
      this.toastMessage.set('');
    }, 3000);
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }

  getBlogs(): Blog[] {
    return [
      {
        id: 1,
        title: "The Future of Web Design: Trends to Watch in 2024",
        author: "Sarah Johnson",
        cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        blog: "Exploring the latest trends and technologies that are shaping the future of web design and user experience. From AI-powered design tools to immersive 3D interfaces, discover what's coming next in the world of digital design.",
        likes: 234,
        comments: 18,
        publishDate: new Date('2024-01-15'),
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
      },
    ];
  }
}