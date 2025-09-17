import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CredentialService } from '../../services/credential-service';

@Component({
  selector: 'app-navbar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(
    public router: Router,
    public authService: AuthService,
    private credentialService: CredentialService
  ) { }

  isAdmin(): boolean {
    return true;
  }
  isValidUser(): boolean {
    return true;
  }

  async logout() {
    await this.credentialService.LogoutService();
  }
}
