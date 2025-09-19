import { Component, signal } from '@angular/core';
import { BlogCard } from '../home/blog-card/blog-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BlogObject } from '../../services/blog-service';

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

  getBlogs(): BlogObject[] {
    return [];
  }
}