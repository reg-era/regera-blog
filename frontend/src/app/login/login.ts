import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CredentialService, LoginFormModel } from '../../services/credential-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  hidePassword = true;
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  _Refresh = true;

  constructor(
    private formBuilder: FormBuilder,
    private credentialService: CredentialService,
    public router: Router
  ) { }

  ngOnInit() {
    this.credentialService.CheckAuthentication().subscribe(auth => {
        if (auth.valid) this.router.navigate(['/']);
      this._Refresh = false;
    })
    this._Refresh = false;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    const form: LoginFormModel = {
      username: this.loginForm.get('email')?.value,
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }

    const response = await this.credentialService.LoginService(form);

    if (!response.success) {
      this.errorMessage = response.message || 'Oops something is wrong';
    }
    this.isLoading = false;
    this.loginForm.reset();
  }

}
