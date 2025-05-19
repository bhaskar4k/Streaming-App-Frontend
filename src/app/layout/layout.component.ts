import { Component } from '@angular/core';
import { redirect_to_home } from '../utility/common-utils';
import { AuthenticationService } from '../service/authentication/authentication.service';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(
    private authService: AuthenticationService,
  ) { }

  loadHomePage() {
    if (this.authService.getToken()) {
      redirect_to_home();
    }
  }
}
