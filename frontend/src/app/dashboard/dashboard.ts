import { Component, OnInit, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../services/admin-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CredentialService } from '../../services/credential-service';
import { Router } from '@angular/router';
import { Dialog } from './dialog/dialog';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class Dashboard implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private credentialService: CredentialService,
    private router: Router,
  ) {
    this.credentialService.CheckAuthentication().subscribe((res) => {
      if (!res || res.role !== 'ADMIN') {
        this.router.navigate(['/']);
        return
      }
    })
  }

  EscalateForm!: FormGroup;
  DeleteUserForm!: FormGroup;
  DeleteBlogForm!: FormGroup;

  ngOnInit(): void {
    this.EscalateForm = this.formBuilder.group({ username: ['', Validators.required] })
    this.DeleteUserForm = this.formBuilder.group({ username: ['', Validators.required] })
    this.DeleteBlogForm = this.formBuilder.group({ id: ['', Validators.required] })
  }

  confirmAction(message: { title: string, message: string }, onConfirm: () => void) {
    const dialogRef = this.dialog.open(Dialog, { data: message });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        onConfirm();
      }
    });
  }

  onEscalateUser() {
    if (this.EscalateForm.valid) {
      const username = this.EscalateForm.get('username')?.getRawValue();
      this.confirmAction({
        title: 'Escaling User to admin',
        message: `Are you sure to escale ${username} into admin`,
      }, () => {
        this.adminService.escalateAdmin(username).subscribe((res) => {
          if (res) {
            this.showMessage(`${res}`, 'success');
          } else {
            this.showMessage(`Faild to escale or User not found`, 'error');
          }
        });
      })
    }
    this.EscalateForm.reset();
  }

  onBanUser() {
    if (this.DeleteUserForm.valid) {
      const username = this.DeleteUserForm.get('username')?.getRawValue();
      this.adminService.removeUser(username).subscribe((res) => {
        switch (res) {
          case 200:
            this.showMessage(`The user ${username} is banned`, 'success');
            break;
          case 404:
            this.showMessage(`The user ${username} not found`, 'error');
            break;
          default:
            this.showMessage(`Something wrong on submiting`, 'info');
            break;
        }
      });
      this.DeleteUserForm.reset();
    }
  }

  onRemoveBlog() {
    if (this.DeleteBlogForm.valid) {
      const blog = this.DeleteBlogForm.get('id')?.getRawValue();
      const blogId = Number.parseInt(blog);

      if (Number.isNaN(blogId) || blogId <= 0) {
        this.showMessage(`Invalid blog ID`, 'error');
      } else {
        this.adminService.removeBlog(blogId).subscribe((res) => {
          switch (res) {
            case 200:
              this.showMessage(`The blog ${blogId} is removed`, 'success');
              break;
            case 404:
              this.showMessage(`The blog ${blogId} not found`, 'error');
              break;
            default:
              this.showMessage(`Something wrong on submiting`, 'info');
              break;
          }
        });
      }
    }
    this.DeleteBlogForm.reset();
  }

  onClearReport() { }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Close', config);
  }
}
