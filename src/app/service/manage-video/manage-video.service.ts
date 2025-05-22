import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EndpointMicroservice, EndpointUpload } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ManageVideoService {
  private BASE_URL = EndpointMicroservice.upload;

  constructor(private http: HttpClient) {}

  GetUploadedVideoList(): Observable<any> {
    return this.http.get(this.BASE_URL + EndpointUpload.get_uploaded_video_list);
  }

  DoDeleteVideo(t_video_info_id: number): Observable<any> {
    return this.http.post(this.BASE_URL + EndpointUpload.delete_video, { t_video_info_id });
  }

  DoEditVideo(obj: any): Observable<any> {
    return this.http.post(this.BASE_URL + EndpointUpload.edit_video, obj);
  }

  DoDownloadVideo(guid: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.BASE_URL + EndpointUpload.download_video + "/" + guid, {responseType: 'blob',observe: 'response'});
  }

  GetDeletedVideoList(): Observable<any> {
    return this.http.get(this.BASE_URL + EndpointUpload.get_deleted_video_list);
  }

  DoRestoreVideo(t_video_info_id: number): Observable<any> {
    return this.http.post(this.BASE_URL + EndpointUpload.restore_video, { t_video_info_id });
  }
}
