import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogFormModel, BlogObject, BlogService } from '../../services/blog-service';
import { CredentialService } from '../../services/credential-service';
import { ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-newblog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './newblog.html',
  styleUrl: './newblog.scss'
})
export class Newblog implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Form and state properties
  blogForm: FormGroup;
  onEditing: boolean = false;
  blogEditing: number = 0;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = false;

  // File handling properties
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];

  // Character limits
  readonly titleMaxLength = 100;
  readonly descriptionMaxLength = 200;
  readonly contentMinLength = 50;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private credentialService: CredentialService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.blogForm = this.formBuilder.group<BlogFormModel>({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(this.titleMaxLength)
      ]],
      media: [null],
      content: ['', [
        Validators.required,
        Validators.minLength(this.contentMinLength)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(this.descriptionMaxLength)
      ]],
    });
  }

  ngOnInit(): void {
    this.credentialService.CheckAuthentication().subscribe(auth => {
      if (!auth) this.router.navigate(['/']);
    })

    this.route.paramMap.subscribe(params => {
      this.blogEditing = parseInt(params.get('id') || '') || 0;

      if (this.blogEditing > 0) {
        this.onEditing = true;
        this.loadBlogForEditing(this.blogEditing);
      } else {
        this.onEditing = false;
        this.resetForm();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }

  private async loadBlogForEditing(blogId: number): Promise<void> {
    try {
      const blogData: BlogObject = (await this.blogService.getBlog(blogId)).data;
      console.log(blogData);
      this.blogForm.get('title')?.setValue(blogData.title);
      this.blogForm.get('description')?.setValue(blogData.description);
      this.blogForm.get('content')?.setValue(blogData.content);
    } catch {
      console.log('Faild to get blog data');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.errorMessage = null;

    if (!this.isValidFileType(file)) {
      this.errorMessage = 'Please select a valid image (JPG, PNG, GIF, WebP) or video (MP4, AVI, MOV, WMV) file.';
      this.showMessage(this.errorMessage, 'error');
      this.resetFileInput();
      return;
    }

    if (file.size > this.maxFileSize) {
      this.errorMessage = `File size must be less than ${this.maxFileSize / (1024 * 1024)}MB.`;
      this.showMessage(this.errorMessage, 'error');
      this.resetFileInput();
      return;
    }

    this.selectedFile = file;
    this.blogForm.get('media')?.setValue(file);

    if (this.isImage(file)) {
      this.createImagePreview(file);
    }

    this.showMessage('File selected successfully', 'success');
  }

  private isValidFileType(file: File): boolean {
    return this.allowedImageTypes.includes(file.type) ||
      this.allowedVideoTypes.includes(file.type);
  }

  isImage(file: File): boolean {
    return this.allowedImageTypes.includes(file.type);
  }

  private createImagePreview(file: File): void {
    if (this.imagePreview && this.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async submitForm(): Promise<void> {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.showMessage(this.errorMessage, 'error');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      let response;

      // if (this.onEditing) {
      // response = await this.blogService.updateBlog(this.blogForm.getRawValue());
      // } else {
      response = await this.blogService.sendBlog(this.blogForm.getRawValue());
      this.successMessage = 'Blog published successfully!';
      // }

      if (response.success) {
        this.showMessage(this.successMessage, 'success');
        this.router.navigate(['/profile']);
      } else {
        this.showMessage(response.message || 'Failed to save blog. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
      this.showMessage('An unexpected error occurred. Please try again.', 'error');
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.blogForm.controls).forEach(key => {
      const control = this.blogForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetForm(): void {
    this.blogForm.reset();
    this.errorMessage = null;
    this.successMessage = null;
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Close', config);
  }

  // Getter methods for template
  get titleLength(): number {
    return this.blogForm.get('title')?.value?.length || 0;
  }

  get descriptionLength(): number {
    return this.blogForm.get('description')?.value?.length || 0;
  }

  get contentLength(): number {
    return this.blogForm.get('content')?.value?.length || 0;
  }

  get isTitleWarning(): boolean {
    return this.titleLength > this.titleMaxLength * 0.8;
  }

  get isTitleDanger(): boolean {
    return this.titleLength > this.titleMaxLength * 0.95;
  }

  get isDescriptionWarning(): boolean {
    return this.descriptionLength > this.descriptionMaxLength * 0.8;
  }

  get isDescriptionDanger(): boolean {
    return this.descriptionLength > this.descriptionMaxLength * 0.95;
  }

  // Form validation helpers
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.blogForm.get(fieldName);
    return !!(field?.hasError(errorType) && (field?.dirty || field?.touched));
  }
}
