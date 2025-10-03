import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { BlogCard } from '../home/blog-card/blog-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BlogObject } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserObject, UserService } from '../../services/user-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CredentialService } from '../../services/credential-service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-bloger',
  imports: [AsyncPipe, MatProgressSpinner, FormsModule, BlogCard, MatCardModule, MatIconModule, MatFormFieldModule, MatListModule],
  templateUrl: './bloger.html',
  styleUrl: './bloger.css'
})

export class Bloger implements OnInit {
  blogger$: BehaviorSubject<UserObject | null>;
  blogs$: BehaviorSubject<BlogObject[] | null>;

  isOwner = false;

  availableReasons = [
    'Spam or misleading',
    'Harassment or hate speech',
    'Inappropriate content',
    'Fake identity',
    'Other'
  ];
  selectedReasons: string[] = [];
  reportMessage: string = '';
  reportDetails: string = '';
  showReport = false;
  showToast = signal(false);
  toastMessage = signal<string>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private credentialService: CredentialService
  ) {
    this.blogger$ = new BehaviorSubject<UserObject | null>(null);
    this.blogs$ = new BehaviorSubject<BlogObject[] | null>(null);
  }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username && this.router.url != '/profile') {
      this.router.navigate(['/']);
      return;
    }

    if (this.router.url == '/profile') {
      this.isOwner = true;
    } else {
      const ping = this.credentialService.CheckAuthentication();
      ping.subscribe(obj => {
        if (obj && username == obj.username) this.router.navigate(['/profile']);
      })
    }

    this.userService.getBloger(username).subscribe((data) => {
      if (data) {
        this.blogger$.next(data.profile);
        this.blogs$.next(data.blogs);
      }
    });
  }

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

  async toggleFollow() {
    // const response = await this.userService.makeFollow(this.blogger.username);
    // if (response.success) {
    // this.blogger.isFollowing = response.data.status == 1;
    // this.blogger.followers = response.data.follows;
    // }
    // this.cdr.markForCheck();
  }

  getBlogs(): BlogObject[] {
    return [];
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date == '' ? new Date() : new Date(date));
  }
}
