import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { AuthenticationService } from './service/authentication/authentication.service';

@Component({
  selector: 'app-root',
  imports: [LoginComponent, LayoutComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  IsLoggedIn = false;
  title = "Streaming App";

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.IsLoggedIn = true;
    }
  }
}
