import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { StreamingService } from '../../service/streaming/streaming.service';
// import { VideoChunkService } from '../services/video-chunk.service';

@Component({
  selector: 'app-custom-video-player',
  imports: [],
  templateUrl: './custom-video-player.component.html',
  styleUrls: ['./custom-video-player.component.css']
})
export class CustomVideoPlayerComponent implements AfterViewInit {
  @Input() guid: string = '';
  @Input() video_info: any = null;
  @Input() posterSrc: string | null = null;

  chunk_count: number = 0;

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  currentChunk = -1;
  chunkCache = new Map<number, string>();  // Map<chunkIndex, blobURL>

  constructor(private streamingService: StreamingService) { }

  ngOnInit(): void {
    console.log(this.guid, "OnInit");
    console.log(this.video_info, "OnInit");

    this.chunk_count = this.video_info.chunkCount;

    this.loadChunks(1);
  }

  ngAfterViewInit(): void {
    // const video = this.videoRef.nativeElement;
    // video.addEventListener('timeupdate', () => this.checkAndLoadChunks(video));
    // this.loadChunks(1);
  }

  private checkAndLoadChunks(video: HTMLVideoElement) {
    const chunkIndex = Math.floor(video.currentTime / 5);

    if (chunkIndex !== this.currentChunk) {
      this.currentChunk = chunkIndex;
      this.loadChunks(chunkIndex);
    }

    if (!this.chunkCache.has(chunkIndex + 1)) {
      this.loadChunks(chunkIndex + 1);
    }
  }

  private loadChunks(index: number) {
    this.streamingService.GetVideoChunks(this.guid, index).subscribe((blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      this.videoRef.nativeElement.src = blobUrl;
      this.videoRef.nativeElement.play();
    });
  }
}