import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EndpointMicroservice, EndpointStreaming } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {
  private BASE_URL = EndpointMicroservice.streaming;

  constructor(private http: HttpClient) { }

  DoGetVideoInfoForStreaming(guid: string | null): Observable<any> {
    return this.http.get(this.BASE_URL + EndpointStreaming.get_video_information_for_streaming + "/" + guid);
  }

  GetVideoChunk(guid: string, index: number): Observable<Blob> {
    return this.http.get(`${this.BASE_URL}/${"streaming/get_video_file_chunks_in_batch"}/${guid}/${index}`, {
      responseType: 'blob'  // Important: expect binary Blob
    });
  }
}
