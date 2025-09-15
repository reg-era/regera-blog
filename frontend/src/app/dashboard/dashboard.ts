import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatListModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  blogUrl = '';
  userUrl = '';

  reports = [
    { id: 1, user: 'john_doe', message: 'Spam content in blog post.', reported: 'masda', date: new Date() },
    { id: 2, user: 'admin42', message: 'Offensive language in comments.', reported: 'john_doe', date: new Date() }
  ];

  clearReport(id: any) {
  }

  clearBlogUrl() {
    //   this.blogForm.reset();
  }

  clearUserUrl() {
    //   this.userForm.reset();
  }

  validateBlogUrl() {
    //   const url = this.blogForm.value.blogUrl;
    //   console.log('Validating Blog URL:', url);
    //   // Call backend service or navigate to blog...
  }

  validateUserUrl() {
    //   const url = this.userForm.value.userUrl;
    //   console.log('Validating User URL:', url);
    //   // Call backend or show user info...
  }

  banUser() {
    //   const url = this.userForm.value.userUrl;
    //   console.log('Banning user by URL:', url);
    //   // Trigger a ban logic here...
  }
}
