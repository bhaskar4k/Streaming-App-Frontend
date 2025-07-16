import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-watch-video',
  imports: [],
  templateUrl: './watch-video.component.html',
  styleUrl: './watch-video.component.css'
})
export class WatchVideoComponent {
  constructor(
    private route: ActivatedRoute
  ) { }

  guid: string = '';
  playback: number = 0;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.guid = params.get('v') || '';
      this.playback = Number(params.get('playback')) || 0;
    });
  }
}
