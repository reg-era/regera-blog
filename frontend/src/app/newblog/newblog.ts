import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogFormModel, BlogService } from '../../services/blog-service';
import { CredentialService } from '../../services/credential-service';


@Component({
  selector: 'app-newblog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './newblog.html',
  styleUrl: './newblog.css'
})
export class Newblog implements OnInit {
  blogForm: FormGroup<BlogFormModel>;

  onEditing: boolean = false;
  blogEditing: number = 0;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fromBuilder: FormBuilder,
    private blogService: BlogService,
    private credentialService: CredentialService,
    private router: Router
  ) {
    this.blogForm = this.fromBuilder.group<BlogFormModel>({
      title: ['', Validators.required],
      media: [null],
      content: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.credentialService.CheckAuthentication().subscribe(auth => {
      if (!auth.valid) this.router.navigate(['/']);
    })

    this.route.queryParams.subscribe(params => {
      this.blogEditing = params['blog'];
      if (this.blogEditing && this.blogEditing != 0) {
        this.onEditing = true;
      } else if (this.blogEditing && this.blogEditing != 0) {
        console.log("invalid editing blog permission");
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      this.errorMessage = 'Only images or videos are allowed!';
      return;
    }

    this.blogForm.get('media')?.setValue(file);
  }

  async submitForm() {
    const response = await this.blogService.sendBlog(this.blogForm.getRawValue());
    if (!response.success) {
      this.errorMessage = response.message || 'Oops something is wrong';
    }
  }
}