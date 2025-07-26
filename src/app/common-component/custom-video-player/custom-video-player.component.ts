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

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  currentChunk = -1;
  chunkCache = new Map<number, string>();  // Map<chunkIndex, blobURL>

  constructor(private streamingService: StreamingService) { }

  ngOnInit(): void {
    console.log(this.guid, "OnInit");
  }

  ngAfterViewInit(): void {
    const video = this.videoRef.nativeElement;
    video.addEventListener('timeupdate', () => this.checkAndLoadChunks(video));
    this.loadChunks(1);
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
    const toLoad = [index, index + 1, index + 2].filter(i => !this.chunkCache.has(i));
    if (toLoad.length === 0) return;

    this.streamingService.GetVideoChunks(this.guid, index).subscribe((chunkList: any[]) => {
      chunkList.forEach((base64: string, i: number) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let j = 0; j < binary.length; j++) {
          bytes[j] = binary.charCodeAt(j);
        }

        const blobUrl = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
        const chunkIndex = index + i;
        this.chunkCache.set(chunkIndex, blobUrl);

        if (chunkIndex === index && !this.videoRef.nativeElement.src) {
          this.videoRef.nativeElement.src = blobUrl;
          this.videoRef.nativeElement.play();
        }
      });
    });
  }
}
