import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ManageVideoService } from '../../../service/manage-video/manage-video.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { base64toImage } from '../../../utility/common-utils';

@Component({
  selector: 'app-manage',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements AfterViewInit {
  @Input() video_list: any[] = [];
  @Input() column_name: string[] = [];

  displayedColumns: string[] = ["thumbnail", "video_title", "visibility", "uploaded_at", "processing_status", "actions"];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private manageVideoService: ManageVideoService) { }

  ngOnInit(): void {
    this.getUploadedVideos();
  }

  getUploadedVideos(): void {
    this.manageVideoService.GetUploadedVideoList().subscribe({
      next: (res) => {
        if (res && res.status === 200 && res.data) {
          this.dataSource.data = res.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(res.data)
        } else {
          console.error('Unexpected response format:', res);
        }
      },
      error: (err) => {
        console.error('Failed to load videos:', err);
      }
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['video_list']) {
  //     this.dataSource.data = this.video_list;
  //   }

  //   if (changes['column_name']) {
  //     this.displayedColumns = [...this.column_name];
  //   }

  //   if (!this.displayedColumns.includes('actions')) {
  //     this.displayedColumns.push('actions');
  //   }
  // }

  base64Converter(base64: string) {
    return base64toImage(base64);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  editVideo(video: any): void {
    this.router.navigate(['/manage/uploaded-video/edit'], {
      state: {
        ...video,
        old_thumbnail: video.thumbnail
      }
    });
  }

  async deleteVideo(t_video_info_id: number): Promise<void> {
    try {
      const response = await this.manageVideoService.DoDeleteVideo(t_video_info_id).toPromise();
      if (response?.status === 200) {
        location.reload();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  async downloadVideo(guid: string): Promise<void> {
    try {
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
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  watchVideo(guid: string): void {
    this.router.navigate(['/watch'], { queryParams: { v: guid, playback: 0 } });
  }
}
