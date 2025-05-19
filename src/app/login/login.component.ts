// login.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EncryptionDecryption } from '../utility/encryption-decryption';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { Environment } from '../constants/environment';
import { get_ip_address, redirect_to_home } from '../utility/common-utils';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomAlertComponent } from '../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../constants/common-constants';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatDialogModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  login = { email: '', password: '' };
  signUp = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

  showAlertModal = false;
  headerTextOfAlertModal: string | null = null;
  bodyTextOfAlertModal: string | null = null;
  colorOfAlertModal = 'green';

  private loadAlertModal: any;
  private apiResponseStatus: number | null = null;

  private encryptionDecryption: EncryptionDecryption = new EncryptionDecryption();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    const JWT = localStorage.getItem("JWT");
    if (JWT) {
      redirect_to_home(this.router);
    }
  }

  togglePanel(signUp: boolean) {
    const container = document.getElementById('login_child_container');
    if (signUp) container?.classList.add("right-panel-active");
    else container?.classList.remove("right-panel-active");
  }

  validateSignUp(): boolean {
    const { firstName, lastName, email, password, confirmPassword } = this.signUp;

    if (!firstName) {
      this.openDialog('SignUp', "Firstname can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    if (!lastName) {
      this.openDialog('SignUp', "Lastname can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    if (!email) {
      this.openDialog('SignUp', "Email can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    if (!password) {
      this.openDialog('SignUp', "Password can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    if (!confirmPassword) {
      this.openDialog('SignUp', "Confirm Password can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    if (password !== confirmPassword) {
      this.openDialog('SignUp', "Password and Confirm password is not matching.", ResponseTypeColor.INFO, null);
      return false;
    }
    
    return true;
  }

  async doSignUp() {
    if (!this.validateSignUp()) return;

    // const { firstName, lastName, email, password } = this.signUp;
    // const encryptedPassword = this.encryption.Encrypt(password);
    // const response = await this.authService.doSignUpService({ first_name: firstName, last_name: lastName, email, password: encryptedPassword });
    // this.apiResponseStatus = response.status;

    // if (response.status === 200) {
    //   this.alert(response.message, Environment.colorSuccess, Environment.alert_modal_header_signup);
    //   this.signUp = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
    // } else {
    //   this.alert(response.message, Environment.colorError, Environment.alert_modal_header_signup);
    // }
  }

  validateLogin(): boolean {
    const { email, password } = this.login;
    if (!email) {
      this.openDialog('Login', "Email can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    if (!password) {
      this.openDialog('Login', "Password can't be empty.", ResponseTypeColor.INFO, null);
      return false;
    }
    return true;
  }

  async doLogin() {
    if (!this.validateLogin()) return;

    // const ip = await get_ip_address();
    // const encryptedPassword = this.encryption.Encrypt(this.login.password);
    // const response = await this.authService.doLoginService({ email: this.login.email, password: encryptedPassword, ip_address: ip });
    // this.apiResponseStatus = response.status;

    // if (response.status === 200) {
    //   localStorage.setItem("JWT", JSON.stringify(response.data));
    //   redirectToHome(this.router);
    // } else {
    //   this.alert(response.message, Environment.colorError, Environment.alert_modal_header_login);
    // }
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
