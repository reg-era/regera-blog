import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogFormModel, BlogService } from '../../services/blog-service';
import { CredentialService } from '../../services/credential-service';
import { ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MediaService } from '../../services/media-service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-newblog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './newblog.html',
  styleUrl: './newblog.scss'
})
export class NewblogComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private oneSubmit = false;

  blogForm: FormGroup;
  onEditing: boolean = false;
  blogEditing: number = 0;

  selectedFile: File | null = null;
  mediaPreview$: BehaviorSubject<string | null>;
  fileExistForEditing: boolean = false;

  changeTriggred: boolean = false;

  maxFileSizeImage = 5 * 1024 * 1024;   // 5MB
  maxFileSizeVideo = 15 * 1024 * 1024;  // 15MB
  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  allowedVideoTypes = ['video/mp4', 'video/webm'];

  readonly titleMaxLength = 100;
  readonly descriptionMaxLength = 200;
  readonly contentMinLength = 300;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private credentialService: CredentialService,
    private router: Router,
    private snackBar: MatSnackBar,
    private mediaService: MediaService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.mediaPreview$ = new BehaviorSubject<string | null>(null);
    this.blogForm = this.formBuilder.group<BlogFormModel>({
      title: ['', [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(this.titleMaxLength)
      ]],
      media: [null],
      content: ['', [
        Validators.required,
        Validators.minLength(this.contentMinLength),
        Validators.maxLength(5_000)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(100),
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
    if (this.mediaPreview$.value) {
      URL.revokeObjectURL(this.mediaPreview$.value);
    }
    this.mediaPreview$.unsubscribe();
  }

  private loadBlogForEditing(blogId: number) {
    this.blogService.canEditBlog(blogId).subscribe((res) => {
      if (!res) {
        this.router.navigate(['/error/401'], {
          state: { fromApp: true }
        });
      }
    });
    this.blogService.getBlog(blogId).subscribe((blog) => {
      if (blog) {
        this.blogForm.get('title')?.setValue(blog.title);
        this.blogForm.get('description')?.setValue(blog.description);
        this.blogForm.get('content')?.setValue(blog.content);

        if (!blog.media.includes("default-blog")) {
          this.fileExistForEditing = true;
          this.mediaService.urlToBlobMedia(blog.media).subscribe(blob => {
            const file = blog.media.endsWith("mp4")
              ? new File([blob], 'video.mp4', { type: 'video/mp4' })
              : new File([blob], 'image.jpeg', { type: 'image/jpeg' });

            this.selectedFile = file;
            this.blogForm.get('media')?.setValue(file);

            this.createImagePreview(file);
            this.changeDetector.markForCheck();
          });
        }
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!this.allowedImageTypes.includes(file.type) && !this.allowedVideoTypes.includes(file.type)) {
      this.showMessage('Please select a valid image (JPG, JEPG, PNG, WebP) or video (MP4, WebM) file.', 'error');
      this.resetFileInput();
      return;
    }

    if (this.allowedImageTypes.includes(file.type) && file.size > this.maxFileSizeImage) {
      this.showMessage(`File size must be less than ${this.maxFileSizeImage / (1024 * 1024)}MB for images.`, 'error');
      this.resetFileInput();
      return;
    }
    if (this.allowedVideoTypes.includes(file.type) && file.size > this.maxFileSizeVideo) {
      this.showMessage(`File size must be less than ${this.maxFileSizeVideo / (1024 * 1024)}MB for videos.`, 'error');
      this.resetFileInput();
      return;
    }

    this.selectedFile = file;
    this.blogForm.get('media')?.setValue(file);

    this.createImagePreview(file);

    this.showMessage('File selected successfully', 'success');
    this.changeTriggred = true;
  }

  isImage(file: File): boolean {
    return this.allowedImageTypes.includes(file.type);
  }

  isVideo(file: File): boolean {
    return this.allowedVideoTypes.includes(file.type);
  }

  private createImagePreview(file: File): void {
    if (this.mediaPreview$.closed) return;
    if (this.mediaPreview$.value && this.mediaPreview$.value.startsWith('blob:')) {
      URL.revokeObjectURL(this.mediaPreview$.value);
    }
    this.mediaPreview$.next(URL.createObjectURL(file));
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submitForm() {
    if (this.oneSubmit) return;
    this.oneSubmit = true;

    if (this.blogForm.invalid) {
      this.markFormGroupTouched();
      this.showMessage('Please fill in all required fields correctly.', 'error');
      return;
    }

    if (this.onEditing) {
      this.blogService.updateBlog(this.blogEditing, this.blogForm.getRawValue(), this.changeTriggred).subscribe((res) => {
        if (res) {
          this.showMessage(res, 'error');
        } else {
          this.showMessage('Blog published successfully!', 'success');
          this.router.navigate(['/profile']);
        }
        this.oneSubmit = false;
      });
    } else {
      this.blogService.sendBlog(this.blogForm.getRawValue()).subscribe((res) => {
        if (res) {
          this.showMessage(res, 'error');
        } else {
          this.showMessage('Blog published successfully!', 'success');
          this.router.navigate(['/profile']);
        }
        this.oneSubmit = false;
      });
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
