import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';


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
  onEditing: boolean = false;
  blogEditing: number = 0;

  blogForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  tags: string[] = [];
  tagInput: string = '';
  description = "";

  addDescControl = new FormControl('');

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      coverImage: [null],
      content: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.blogEditing = params['blog'];
      if (this.blogEditing && this.blogEditing != 0 && this.validateBlog(this.blogEditing)) {
        this.onEditing = true;
      } else if (this.blogEditing && this.blogEditing != 0) {
        console.log("invalid editing blog permission");
      }
    });
  }

  validateBlog(id: number): boolean {
    this.blogForm.get('content')?.setValue('New Default Value content');
    this.blogForm.get('description')?.setValue('New Default Value desription');

    return true;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.blogForm.patchValue({ coverImage: file });
      this.blogForm.get('coverImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  addTag(event: any): void {
    const input = event.target;
    const value = input.value?.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    input.value = '';
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  addDescFromControl() {
    const value = this.tagInput.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    this.tagInput = '';
  }

  submitForm(): void {
    if (this.blogForm.valid) {
      const formData = {
        ...this.blogForm.value,
        tags: this.tags
      };
      console.log('Blog Submitted:', formData);
      // TODO: Send data to backend
    } else {
      this.blogForm.markAllAsTouched();
    }
  }
}