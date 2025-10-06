import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { BlogCard } from '../home/blog-card/blog-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BlogObject } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserObject, UserService } from '../../services/user-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CredentialService } from '../../services/credential-service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-bloger',
  imports: [
    AsyncPipe,
    MatProgressSpinner,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    BlogCard,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatListModule
  ],
  templateUrl: './bloger.html',
  styleUrl: './bloger.scss'
})

export class Bloger implements OnInit, OnDestroy {
  blogger$: BehaviorSubject<UserObject | null>;
  blogs$: BehaviorSubject<BlogObject[] | null>;

  isOwner = false;
  isAuthenticated = false;

  ReportForm!: FormGroup;
  availableReasons = ['Spam or misleading', 'Harassment or hate speech', 'Inappropriate content'];

  showReport = false;
  showToast = signal(false);
  toastMessage = signal<string>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private credentialService: CredentialService,
    private fb: FormBuilder
  ) {
    this.blogger$ = new BehaviorSubject<UserObject | null>(null);
    this.blogs$ = new BehaviorSubject<BlogObject[] | null>(null);

    this.ReportForm = this.fb.group({
      reasons: this.fb.array(this.availableReasons.map(() => this.fb.control(false))),
      details: this.fb.control('')
    });
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
        if (obj) {
          if (username == obj.username) {
            this.router.navigate(['/profile']);
            return
          }
          this.isAuthenticated = true;
        }
      })
    }

    this.userService.getBloger(username).subscribe((data) => {
      if (data) {
        this.blogger$.next(data.profile);
        this.blogs$.next(data.blogs);
      }
    });
  }

  ngOnDestroy(): void {
    this.blogger$.unsubscribe();
    this.blogs$.unsubscribe();
  }

  confirmReport(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    const selectedReasons: string[] = this.ReportForm.value.reasons
      .map((checked: boolean, i: number) => checked ? this.availableReasons[i] : null)
      .filter((v: string | null) => v !== null);

    if (selectedReasons.length > 0 || this.ReportForm.value.details.length > 0) {
      this.userService.makeReport(
        this.blogger$.value?.username || '',
        selectedReasons,
        this.ReportForm.value.details || ''
      ).subscribe((res => {
        this.showReport = false;
        this.displayToast(res);
      }))
    }
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
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.blogger$.value) {
      this.userService.makeFollow(this.blogger$.value.username).subscribe((res) => {
        if (res != null) {
          const newUser = {
            ...this.blogger$.value!,
            isFollowing: res.status === 1,
            followers: res.follows
          };
          this.blogger$.next(newUser);
        }
      });
    }
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
