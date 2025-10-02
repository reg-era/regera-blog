import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  _Refresh = true;

  constructor(
    private formBuilder: FormBuilder,
    private credentialService: CredentialService,
    public router: Router
  ) { }

  ngOnInit() {
    this.credentialService.CheckAuthentication().subscribe(auth => {
      if (auth) this.router.navigate(['/']);
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

    const form: LoginFormModel = {
      username: this.loginForm.get('email')?.value,
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }

    this.credentialService
      .LoginService(form)
      .subscribe(res => {
        if (res) {
          this.errorMessage = res || 'Oops something is wrong';
          this.loginForm.reset();
        }
      });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

}
