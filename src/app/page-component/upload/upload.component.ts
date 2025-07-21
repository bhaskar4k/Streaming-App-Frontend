import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UploadService } from '../../service/upload/upload.service';
import { Environment } from '../../constants/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/common-constants';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { base64toImage } from '../../utility/common-utils';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  faTrash = faTrash;

  fileNotUploaded = true;
  videoPublicityStatus = 0;
  videoUploadSuccess = false;
  progress = 0;
  thumbnail: File | null = null;
  thumbnailName = '';
  new_thumbnail_base64: string | null = null;
  videoInfo: any = null;
  newVideoTitle = '';
  newVideoDescription = '';

  tagInput: string = '';
  tags: string[] = [];

  maxCharacterTitle = 100;
  maxCharacterDescription = 5000;

  isDragOver: boolean = false;
  isThumbnailDragOver: boolean = false;

  constructor(
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  onInputChange(): void {
    if (this.tagInput.length > 500) {
      this.tagInput = this.tagInput.slice(0, 500);
    }
    this.updateTagsFromInput();
  }

  updateTagsFromInput(): void {
    this.tags = this.tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.tagInput = this.tags.join(', ');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'video/mp4') {
      this.handleVideoUpload({ target: { files: [file] } } as any);
    } else {
      this.openDialog('Upload', "Please select a video file.", ResponseTypeColor.INFO, null);
    }
  }

  handleVideoUpload(event: any): void {
    this.fileNotUploaded = false;
    const file = event.target.files[0];

    if (!file) {
      this.openDialog('Upload', "Please select a video file.", ResponseTypeColor.INFO, null);
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    this.uploadService.DoUploadVideo(formData, (progress: number) => {
      this.progress = progress;
    }).subscribe({
      next: (result: any) => {
        if (result.status === 200) {
          this.videoUploadSuccess = true;
          this.videoInfo = result.data;
          this.openDialog('Upload', result.message, ResponseTypeColor.SUCCESS, null);
        } else {
          this.openDialog('Upload', result.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: () => {
        this.openDialog('Upload', "Error uploading video.", ResponseTypeColor.ERROR, null);
      }
    });
  }

  handleVideoStatusToggleSwitch(): void {
    this.videoPublicityStatus = this.videoPublicityStatus === 0 ? 1 : 0;
  }

  onThumbnailDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isThumbnailDragOver = true;
  }

  onThumbnailDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isThumbnailDragOver = false;
  }

  onThumbnailDrop(event: DragEvent): void {
    event.preventDefault();
    this.isThumbnailDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.thumbnailSave({ target: { files: [file] } } as any);
    } else {
      this.openDialog('Upload', "Please drop a valid image file.", ResponseTypeColor.INFO, null);
    }
  }

  thumbnailSave(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.thumbnailName = file.name;
      this.thumbnail = file;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Raw = result.split(',')[1]; // Get base64 without metadata
      this.new_thumbnail_base64 = base64toImage(base64Raw);
    };

    reader.readAsDataURL(file);
  }

  removeThumbnail(event: Event): void {
    event.preventDefault();
    this.thumbnail = null;
    this.thumbnailName = "";
    this.new_thumbnail_base64 = "";
  }

  saveVideoInfo(): void {
    const formData = new FormData();
    formData.append("title", this.newVideoTitle);
    formData.append("description", this.newVideoDescription);
    formData.append("is_public", this.videoPublicityStatus.toString());
    if (this.thumbnail) formData.append("thumbnail", this.thumbnail);
    formData.append("video_info", JSON.stringify(this.videoInfo));

    this.activeMatProgressBar();

    try {
      this.uploadService.DoUploadVideoInfo(formData).subscribe({
        next: (response: any) => {
          this.hideMatProgressBar();

          if (response.status === 200) {
            this.openDialog('Upload', response.message, ResponseTypeColor.SUCCESS, null);
          } else {
            this.openDialog('Upload', response.message, ResponseTypeColor.ERROR, null);
          }
        },
        error: () => {
          this.hideMatProgressBar();
          this.openDialog('Upload', "Internal server error.", ResponseTypeColor.ERROR, null);
        }
      });
    } catch (e) {
      this.hideMatProgressBar();
      this.openDialog('Upload', "Internal server error.", ResponseTypeColor.ERROR, null);
    }
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
