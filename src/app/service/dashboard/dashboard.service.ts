import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointMicroservice, EndpointDashboard } from '../../endpoints/endpoints';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BASE_URL = EndpointMicroservice.dashboard;

  constructor(private http: HttpClient) {}

  DoGetMenu(): Observable<any> {
    return this.http.get<any>(this.BASE_URL + EndpointDashboard.menu);
  }
}
