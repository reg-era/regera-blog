import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { BlogCard } from '../home/blog-card/blog-card';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  styleUrl: './bloger.css'
})

export class Bloger implements OnInit {
  blogger$: BehaviorSubject<UserObject | null>;
  blogs$: BehaviorSubject<BlogObject[] | null>;

  isOwner = false;

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

  confirmReport(): void {
    const selectedReasons: string[] = this.ReportForm.value.reasons
      .map((checked: boolean, i: number) => checked ? this.availableReasons[i] : null)
      .filter((v: string | null) => v !== null);

    if (selectedReasons.length > 0 || this.ReportForm.value.details.length > 0) {
      console.log('Selected reasons:', selectedReasons);
      console.log('Additional message:', this.ReportForm.value.details);

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
