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

  constructor(private http: HttpClient) { }

  getJwtObject() {
    const tokenStr = localStorage.getItem(this.tokenKey);
    if (tokenStr) {
      try {
        return JSON.parse(tokenStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    const tokenStr = localStorage.getItem(this.tokenKey);
    if (tokenStr) {
      try {
        const token = JSON.parse(tokenStr);
        return token?.jwt || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return (this.getToken() !== null);
    //token expiration tao check korbo
  }

  setToken(token: string) {
    this.deleteToken();
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  deleteToken() {
    localStorage.removeItem(this.tokenKey);
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
