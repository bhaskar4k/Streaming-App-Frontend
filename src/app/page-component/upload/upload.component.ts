import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../service/upload/upload.service';
import { Environment } from '../../constants/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule, MatDialogModule, MatProgressBarModule],
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  fileNotUploaded = true;
  videoPublicityStatus = 0;
  videoUploadSuccess = false;
  progress = 0;
  thumbnail: File | null = null;
  thumbnailName = '';
  videoInfo: any = null;
  newVideoTitle = '';
  newVideoDescription = '';

  maxCharacterTitle = 100;
  maxCharacterDescription = 5000;

  showAlertModal = false;
  headerTextOfAlertModal: string | null = null;
  bodyTextOfAlertModal: string | null = null;
  colorOfAlertModal = 'green';

  private loadAlertModal: any = null;
  isDragOver: boolean = false;
  isThumbnailDragOver: boolean = false;

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void { }

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
      alert('Please upload an MP4 file.');
    }
  }

  handleVideoUpload(event: any): void {
    this.fileNotUploaded = false;
    const file = event.target.files[0];

    if (!file) {
      //this.alert(Environment.alert_modal_header_video_info_upload, Environment.colorWarning, "Please select a video file.");
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
        } else {
          //this.alert(Environment.alert_modal_header_video_info_upload, Environment.colorError, "Error uploading video! (Internal server error)");
        }
      },
      error: () => {
        console.error("Error uploading video");
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
    alert('Please drop a valid image file.');
  }
}

  thumbnailSave(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.thumbnailName = file.name;
      this.thumbnail = file;
    }
  }

  removeThumbnail(event: Event): void {
    event.preventDefault();
    this.thumbnail = null;
    this.thumbnailName = "";
  }

  saveVideoInfo(): void {
    const formData = new FormData();
    formData.append("title", this.newVideoTitle);
    formData.append("description", this.newVideoDescription);
    formData.append("is_public", this.videoPublicityStatus.toString());
    if (this.thumbnail) formData.append("thumbnail", this.thumbnail);
    formData.append("video_info", JSON.stringify(this.videoInfo));

    this.uploadService.DoUploadVideoInfo(formData).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          //this.alert(Environment.alert_modal_header_video_info_upload, Environment.colorSuccess, response.message);
        } else {
          //this.alert(Environment.alert_modal_header_video_info_upload, Environment.colorError, response.message);
        }
      },
      error: () => {
        //this.alert(Environment.alert_modal_header_video_info_upload, Environment.colorError, "Failed to upload video info.");
      }
    });
  }

  alert(header: string, color: string, message: string): void {
    this.closeAlertModal();
    this.colorOfAlertModal = color;
    this.openAlertModal(header, message);

    this.loadAlertModal = setTimeout(() => {
      this.closeAlertModal();
    }, 5000);
  }

  openAlertModal(header: string, body: string): void {
    this.headerTextOfAlertModal = header;
    this.bodyTextOfAlertModal = body;
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.headerTextOfAlertModal = null;
    this.bodyTextOfAlertModal = null;
    clearTimeout(this.loadAlertModal);
    this.loadAlertModal = null;
  }
}
