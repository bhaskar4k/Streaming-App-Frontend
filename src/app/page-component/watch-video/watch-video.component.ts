import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamingService } from '../../service/streaming/streaming.service';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseTypeColor } from '../../constants/common-constants';
import { CustomVideoPlayerComponent } from '../../common-component/custom-video-player/custom-video-player.component';
import { faCircleUser, faHeart, faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watch-video',
  imports: [
    FontAwesomeModule,
    MatTooltipModule,
    CommonModule,
    CustomVideoPlayerComponent
  ],
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

  faCircleUser = faCircleUser;
  faHeart = faHeart;
  faHeartCrack = faHeartCrack;

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  guid: string = '';
  playback: number = 0;

  video_info: any = {};
  video_description: string = '';
  video_description_show_text: string = 'More';

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
            if (this.video_info.description.length > 200) {
              this.video_description = this.video_info.description.substring(0, 200) + '...';
            } else {
              this.video_description = this.video_info.description;
            }
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

  ShowMoreDescription() {
    if (this.video_description_show_text === 'More') {
      this.video_description_show_text = 'Less';
      this.video_description = this.video_info.description;
    } else {
      this.video_description_show_text = 'More';
      this.video_description = this.video_info.description.substring(0, 200) + '...';
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
