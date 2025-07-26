import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { StreamingService } from '../../service/streaming/streaming.service';
// import { VideoChunkService } from '../services/video-chunk.service';

@Component({
  selector: 'app-custom-video-player',
  imports: [],
  templateUrl: './custom-video-player.component.html',
  styleUrls: ['./custom-video-player.component.css']
})
export class CustomVideoPlayerComponent {
  @Input() guid: string = '';
  @Input() posterSrc: string | null = null;
  @Input() video_info: any = null;

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private streamingService: StreamingService) { }

  ngOnInit(): void {
    console.log(this.guid, "guid");
    console.log(this.video_info, "video_info");
    this.playChunk(1);
  }

  playChunk(index: number): void {
    this.streamingService.GetVideoChunk(this.guid, index).subscribe((blob: Blob) => {
      const videoUrl = URL.createObjectURL(blob);
      this.videoRef.nativeElement.src = videoUrl;
      this.videoRef.nativeElement.play();
    });
  }

}
