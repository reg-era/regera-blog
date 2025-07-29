import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


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
export class Newblog {
  blogForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  tags: string[] = [];
  tagInput: string = '';
  description = "";

  addDescControl = new FormControl('');


  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      coverImage: [null],
      content: ['', Validators.required],
      description: ['', Validators.required],
    });
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