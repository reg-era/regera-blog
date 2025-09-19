import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { BlogCard } from '../home/blog-card/blog-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BlogObject, createEmptyBlogObject } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { createEmptyUserObject, UserObject, UserService } from '../../services/user-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CredentialService } from '../../services/credential-service';

@Component({
  selector: 'app-bloger',
  imports: [MatProgressSpinner, FormsModule, BlogCard, MatCardModule, MatIconModule, MatFormFieldModule, MatListModule],
  templateUrl: './bloger.html',
  styleUrl: './bloger.css'
})

export class Bloger implements OnInit {
  blogger: UserObject = createEmptyUserObject();
  blogs: BlogObject[] = [];

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

  _Refresh = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private credentialService: CredentialService
  ) { }

  async ngOnInit() {
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
        if (username == obj.username) this.router.navigate(['/profile']);
      })
    }

    const response = await this.userService.getBloger(username);
    this.blogger = response.data.profile;
    this.blogs = response.data.blogs;

    this._Refresh = false;
    this.cdr.markForCheck();
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

  toggleFollow() {
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