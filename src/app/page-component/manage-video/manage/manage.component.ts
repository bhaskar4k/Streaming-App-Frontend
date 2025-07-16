import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ManageVideoService } from '../../../service/manage-video/manage-video.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { base64toImage, GetFormattedCurrentDatetime } from '../../../utility/common-utils';
import { page_type_info } from '../../../model/video.model';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResponseTypeColor, VideoProcessingStatus, VideoProcessingStatusDescriptions, VideoVisibility, VideoVisibilityDescriptions } from '../../../constants/common-constants';
import { faCloudArrowDown, faCircleXmark, faEdit, faTrash, faArrowLeftRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-manage',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatProgressBarModule, FontAwesomeModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  @Input() video_list: any[] = [];
  @Input() column_name: string[] = [];

  page_type_info = page_type_info;
  page_type = page_type_info.wrong;
  page_title = "Wrong";

  faCloudArrowDown = faCloudArrowDown;
  faCircleXmark = faCircleXmark;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeftRotate = faArrowLeftRotate;

  VideoVisibility = VideoVisibility;
  VideoVisibilityDescriptions = VideoVisibilityDescriptions;

  video_data: any;
  displayedColumns: string[] = ["thumbnail", "video_title", "visibility", "uploaded_at", "processing_status", "actions"];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private manageVideoService: ManageVideoService,
    private cdr: ChangeDetectorRef
  ) {
    const segments = this.router.url.split('/');
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === "deleted-video") {
      this.page_type = page_type_info.deleted;
      this.page_title = "Deleted Video";
    } else if (lastSegment === "uploaded-video") {
      this.page_type = page_type_info.uploaded;
      this.page_title = "Uploaded Video";
    }
  }

  ngOnInit(): void {
    if (this.page_type === page_type_info.wrong) {
      this.router.navigate(['error']);
    } else {
      this.getUploadedVideos();
    }
  }

  async getUploadedVideos(): Promise<void> {
    try {
      this.activeMatProgressBar();

      if (this.page_type === page_type_info.uploaded) {
        this.manageVideoService.GetUploadedVideoList().subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.video_data = res.data;
              this.dataSource.data = res.data;
              this.hideMatProgressBar();
            }

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
          }
        });
      } else if (this.page_type === page_type_info.deleted) {
        this.manageVideoService.GetDeletedVideoList().subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.video_data = res.data;
              this.dataSource.data = res.data;
              this.hideMatProgressBar();
            }

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
          }
        });
      }
    } catch (err) {
      this.hideMatProgressBar();
      this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
    }
  }

  editVideo(video: any): void {
    this.router.navigate([`/manage/uploaded-video/edit/${video.guid}`], {
      state: {
        ...video,
        old_thumbnail: video.base64EncodedImage
      }
    });
  }

  async deleteVideo(t_video_info_id: number) {
    try {
      this.activeMatProgressBar();
      this.manageVideoService.DoDeleteVideo(t_video_info_id).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.video_data = this.video_data.filter((video: any) => video.t_video_info_id !== t_video_info_id);
            this.dataSource.data = this.video_data;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.hideMatProgressBar();
            this.openDialog("Manage", res.message, ResponseTypeColor.SUCCESS, null);
          } else {
            this.hideMatProgressBar();
            this.openDialog("Manage", res.message, ResponseTypeColor.ERROR, null);
          }
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
        }
      });
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
    }
  }

  async restoreVideo(t_video_info_id: number) {
    try {
      this.activeMatProgressBar();
      this.manageVideoService.DoRestoreVideo(t_video_info_id).subscribe({
        next: (res) => {
          if (res?.status === 200) {
            this.video_data = this.video_data.filter((video: any) => video.t_video_info_id !== t_video_info_id);
            this.dataSource.data = this.video_data;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.hideMatProgressBar();
            this.openDialog("Manage", res.message, ResponseTypeColor.SUCCESS, null);
          } else {
            this.hideMatProgressBar();
            this.openDialog("Manage", res.message, ResponseTypeColor.ERROR, null);
          }
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
        }
      });
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Manage", "Internal server error.", ResponseTypeColor.ERROR, null);
    }
  }

  async downloadVideo(guid: string): Promise<void> {
    try {
      this.activeMatProgressBar();
      const response: any = await this.manageVideoService.DoDownloadVideo(guid).toPromise();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = guid;

      const match = contentDisposition?.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.body]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename + '.mp4';
      a.click();
      window.URL.revokeObjectURL(url);
      this.hideMatProgressBar();
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Manage", "Download failed.", ResponseTypeColor.ERROR, null);
    }
  }

  watchVideo(guid: string): void {
    this.router.navigate(['/watch'], { queryParams: { v: guid, playback: 0 } });
  }

  addVideo(): void {
    this.router.navigate(['/upload']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getVisibilityDescription(visibility: number): string {
    return VideoVisibilityDescriptions[visibility as VideoVisibility] || 'Unknown';
  }

  getVideoProcessingStatusDescriptions(processing_status: number): string {
    return VideoProcessingStatusDescriptions[processing_status as VideoProcessingStatus] || 'Unknown';
  }

  getFormattedCurrentDatetimeForVideos(currentTime: string) {
    return GetFormattedCurrentDatetime(new Date(currentTime));
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
