import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  imports: [MatIcon, MatButtonModule,MatDialogModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) { }
}
