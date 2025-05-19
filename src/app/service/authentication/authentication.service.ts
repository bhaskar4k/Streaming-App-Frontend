import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  tokenKey = 'JWT';
  
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}
