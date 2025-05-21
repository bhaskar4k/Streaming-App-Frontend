import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../constants/common-constants';

@Component({
  selector: 'app-custom-confirm-dialog',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrl: './custom-confirm-dialog.component.css'
})

export class CustomConfirmDialogComponent {
  ResponseTypeColor = ResponseTypeColor;
  formattedText: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    public dialogRef: MatDialogRef<CustomConfirmDialogComponent>,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.formattedText = this.data.text.replace(/\n/g, '<br>');
  }

  sendConfirmStatus(status: boolean) {
    this.dialogRef.close(status);
  }
}