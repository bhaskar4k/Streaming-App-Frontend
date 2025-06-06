// login.component.ts
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatDialogModule, MatProgressBarModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  isSignUpActive = false;
  matProgressBarVisible = false;

  login = {
    email: '',
    password: ''
  };

  signUp = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  private encryptionDecryption: EncryptionDecryption = new EncryptionDecryption();

  constructor(
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      redirect_to_home();
    }
  }

  togglePanel(signUp: boolean) {
    this.isSignUpActive = signUp;
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

  async DoSignUp() {
    if (!this.validateSignUp()) return;

    const { firstName, lastName, email, password } = this.signUp;

    let obj = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: this.encryptionDecryption.Encrypt(password),
    };

    this.activeMatProgressBar();

    this.authService.DoSignUpService(obj).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.hideMatProgressBar();
          this.resetSignUpForm();
          this.openDialog("SignUp", response.message, ResponseTypeColor.SUCCESS, null);
          return;
        }

        this.hideMatProgressBar();
        this.openDialog("SignUp", response.message, ResponseTypeColor.ERROR, null);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("SignUp", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  resetSignUpForm() {
    this.signUp.firstName = '';
    this.signUp.lastName = '';
    this.signUp.email = '';
    this.signUp.password = '';
    this.signUp.confirmPassword = '';
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

    let obj = {
      email: this.login.email,
      password: this.encryptionDecryption.Encrypt(this.login.password),
      ip_address: await get_ip_address()
    };

    this.activeMatProgressBar();

    this.authService.DoLoginService(obj).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.hideMatProgressBar();
          this.authService.setToken(response.data);
          this.openDialog("Login", response.message, ResponseTypeColor.SUCCESS, 'home');
          return;
        }

        this.hideMatProgressBar();
        this.openDialog("Login", response.message, ResponseTypeColor.ERROR, null);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Login", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
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
