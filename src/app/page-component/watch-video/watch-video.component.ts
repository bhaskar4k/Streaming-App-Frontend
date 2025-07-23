import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamingService } from '../../service/streaming/streaming.service';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseTypeColor } from '../../constants/common-constants';

@Component({
  selector: 'app-watch-video',
  imports: [],
  templateUrl: './watch-video.component.html',
  styleUrl: './watch-video.component.css'
})
export class WatchVideoComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private streamingService: StreamingService,
    private cdr: ChangeDetectorRef
  ) { }

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  guid: string = '';
  playback: number = 0;

  video_info: any = {};

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.guid = params.get('v') || '';
      this.playback = Number(params.get('playback')) || 0;
    });

    this.GetVideoInfo();
  }

  GetVideoInfo() {
    this.activeMatProgressBar();

    this.streamingService.DoGetVideoInfoForStreaming(this.guid)
      .subscribe({
        next: (result: any) => {
          this.hideMatProgressBar();

          if (result.status === 200) {
            this.video_info = result.data;
            console.log(this.video_info);
          } else {
            this.openDialog('Upload', result.message, ResponseTypeColor.ERROR, null);
          }
        },
        error: () => {
          this.hideMatProgressBar();
          this.openDialog('Upload', "Failed to fetch video info.", ResponseTypeColor.ERROR, null);
        }
      });
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
