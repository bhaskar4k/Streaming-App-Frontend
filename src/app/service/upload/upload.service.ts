import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EndpointUpload, EndpointMicroservice } from '../../endpoints/endpoints';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }

  private BASE_URL = EndpointMicroservice.upload;

  DoUploadVideo(formData: FormData, onProgress: (progress: number) => void): Observable<any> {
    return this.http.post(this.BASE_URL + EndpointUpload.upload_video, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress = Math.round((100 * event.loaded) / event.total);
              onProgress(progress);
            }
            return null;
          case HttpEventType.Response:
            return event.body;
          default:
            return null;
        }
      }),
    );
  }

  DoUpdateVideoInfo(obj: any): Observable<any> {
    return this.http.post(this.BASE_URL + EndpointUpload.update_video_info, obj);
  }

  DoUploadVideoInfo(formData: FormData): Observable<any> {
    return this.http.post(this.BASE_URL + EndpointUpload.upload_video_info, formData);
  }
}
