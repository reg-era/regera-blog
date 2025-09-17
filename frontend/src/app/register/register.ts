import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, ControlConfig, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CredentialService, RegisterFormModel } from '../../services/credential-service';
import { Router } from '@angular/router';
import { CheckAuthentication } from '../../utils/auth-utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage: string | null = null;
  _Refresh = true;


  registerForm!: FormGroup<RegisterFormModel>;

  constructor(
    private formBuilder: FormBuilder,
    private credentialService: CredentialService,
    private router: Router
  ) { }

  async ngOnInit() {
    const auth = await CheckAuthentication();
    if (auth.valid) this.router.navigate(['/']);
    this._Refresh = false;
    this.registerForm = this.formBuilder.nonNullable.group<RegisterFormModel>({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  };

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const response = await this.credentialService.RegisterService(this.registerForm.getRawValue());
      if (!response.success) {
        this.errorMessage = response.message || 'Oops something is wrong';
      }
      this.isLoading = false;
      this.registerForm.reset();
    }
  }

  get passwordMismatch() {
    return this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.get('confirmPassword')?.touched;
  }
}
