import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../../../service/upload/upload.service';
import { Environment } from '../../../constants/environment';
import { CommonModule, Location } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../constants/common-constants';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { base64toImage } from '../../../utility/common-utils';

@Component({
  selector: 'app-edit-video',
  imports: [CommonModule, FormsModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  maxCharacterTitle = 100;
  maxCharacterDescription = 5000;

  faTrash = faTrash;

  t_video_info_id: any;
  guid: string = '';
  video_title: string = '';
  old_thumbnail: string = '';
  video_description: string = '';
  is_public: number = 0;

  new_thumbnail: File | null = null;
  new_thumbnail_base64: string | null = null;
  thumbnail_name: string = '';
  video_pubblicity_status = 0;

  edited_video_title: string = '';
  edited_video_description: string = '';

  showAlertModal = false;
  headerTextOfAlertModal: string | null = null;
  bodyTextOfAlertModal: string | null = null;
  colorOfAlertModal: string = 'green';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const state = history.state;
    this.t_video_info_id = state.t_video_info_id;
    this.guid = state.guid;
    this.video_title = state.video_title;
    this.old_thumbnail = state.old_thumbnail;
    this.video_description = state.video_description;
    this.is_public = state.is_public;

    this.edited_video_title = this.video_title;
    this.edited_video_description = this.video_description;
    this.video_pubblicity_status = this.is_public;
  }

  handleVideoStatusToggleSwitch() {
    this.video_pubblicity_status = this.video_pubblicity_status === 0 ? 1 : 0;
  }

  thumbnailSave(event: Event): void {
    debugger;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.new_thumbnail = file;
    this.thumbnail_name = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Raw = result.split(',')[1]; // Get base64 without metadata
      this.new_thumbnail_base64 = base64toImage(base64Raw);
    };

    reader.readAsDataURL(file);
  }

  removeThumbnail(event: Event) {
    event.preventDefault();
    this.new_thumbnail = null;
    this.thumbnail_name = '';
  }

  openAlertModal(header: string, body: string, color: string) {
    this.headerTextOfAlertModal = header;
    this.bodyTextOfAlertModal = body;
    this.colorOfAlertModal = color;
    this.showAlertModal = true;

    setTimeout(() => {
      this.showAlertModal = false;
      this.router.navigate(['/manage/uploaded-video']);
    }, 5000);
  }

  async saveVideoInfo() {
    const formData = new FormData();
    formData.append('t_video_info_id', this.t_video_info_id);
    formData.append('guid', this.guid);
    formData.append('title', this.edited_video_title);
    formData.append('description', this.edited_video_description);
    formData.append('is_public', this.video_pubblicity_status.toString());
    if (this.new_thumbnail) {
      formData.append('thumbnail', this.new_thumbnail);
    }

    this.activeMatProgressBar();

    try {
      this.uploadService.DoUpdateVideoInfo(formData)
        .subscribe({
          next: (result: any) => {
            this.hideMatProgressBar();

            if (result.status === 200) {
              this.openDialog('Upload', result.message, ResponseTypeColor.SUCCESS, null);
            } else {
              this.openDialog('Upload', result.message, ResponseTypeColor.ERROR, null);
            }
          },
          error: () => {
            this.hideMatProgressBar();
            this.openDialog('Upload', "Failed to upload video info.", ResponseTypeColor.ERROR, null);
          }
        });
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog('Upload', "Failed to upload video info.", ResponseTypeColor.ERROR, null);
    }
  }

  goBack() {
    this.location.back();
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
