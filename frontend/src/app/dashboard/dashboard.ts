import { Component, OnInit, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AdminService, ReportObject } from '../../services/admin-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CredentialService } from '../../services/credential-service';
import { Router } from '@angular/router';
import { Dialog } from './dialog/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class Dashboard implements OnInit {

  EscalateForm!: FormGroup;
  DeleteUserForm!: FormGroup;
  DeleteBlogForm!: FormGroup;

  reports$: BehaviorSubject<ReportObject[] | null>;

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

    this.reports$ = new BehaviorSubject<ReportObject[] | null>(null);

    this.EscalateForm = this.formBuilder.group({ username: ['', Validators.required] })
    this.DeleteUserForm = this.formBuilder.group({ username: ['', Validators.required] })
    this.DeleteBlogForm = this.formBuilder.group({ id: ['', Validators.required] })
  }

  ngOnInit(): void {
    this.adminService.getReports().subscribe((reports) => {
      if (reports) {
        this.reports$.next(reports);
      }
    })
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
        title: 'Escaling User',
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
      this.confirmAction({
        title: 'Removing user',
        message: `Are you sure to remove ${username}`,
      }, () => {
        this.adminService.removeUser(username).subscribe((res) => {
          if (res) {
            this.showMessage(`${res}`, 'success');
          } else {
            this.showMessage(`Faild to remove or User not found`, 'error');
          }
        });
      })
    }
    this.DeleteUserForm.reset();
  }

  onRemoveBlog() {
    if (this.DeleteBlogForm.valid) {
      const blog = this.DeleteBlogForm.get('id')?.getRawValue();
      const blogId = Number.parseInt(blog);

      if (Number.isNaN(blogId) || blogId <= 0) {
        this.showMessage(`Invalid blog ID`, 'error');
      } else {
        this.confirmAction({
          title: 'Removing blog',
          message: `Are you sure to remove blog ${blogId}`,
        }, () => {
          this.adminService.removeBlog(blogId).subscribe((res) => {
            if (res) {
              this.showMessage(`${res}`, 'success');
            } else {
              this.showMessage(`Faild to remove or blog not found`, 'error');
            }
          });
        })
      }
    }
    this.DeleteBlogForm.reset();
  }

  onClearReport(id: number) {
    this.confirmAction({
      title: 'Removing report',
      message: `Are you sure to remove this report`,
    }, () => {
      this.adminService.removeReport(id).subscribe((res) => {
        if (res) {
          this.showMessage(`${res}`, 'success');
          this.reports$.next(
            (!this.reports$.value || this.reports$.value.length == 0)
              ? []
              : this.reports$.value.filter(rep => rep.reportId == id)
          );
        } else {
          this.showMessage(`Faild to remove this report`, 'error');
        }
      });
    })
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
}
