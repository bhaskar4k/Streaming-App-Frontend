import { EndpointAuthentication, EndpointMicroservice } from '../../endpoints/endpoints';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tokenKey = 'JWT';
  
  private BASE_URL = EndpointMicroservice.authentication;

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  DoSignUpService(obj: any): Observable<any> {
    return this.http.post<any>(this.BASE_URL + EndpointAuthentication.do_signup, obj);
  }

  DoLoginService(obj: any): Observable<any> {
    return this.http.post<any>(this.BASE_URL + EndpointAuthentication.do_login, obj);
  }

  DoLogout(): Observable<any> {
    return this.http.post<any>(this.BASE_URL + EndpointAuthentication.logout, {});
  }

  GetTMstUserIdFromJWTSubject(JWT: string): Observable<any> {
    return this.http.get<any>(this.BASE_URL + EndpointAuthentication.get_userid_from_jwt);
  }
}
