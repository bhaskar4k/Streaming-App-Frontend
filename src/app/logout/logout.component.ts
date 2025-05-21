import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResponseTypeColor } from '../constants/common-constants';
import { CustomAlertComponent } from '../common-component/custom-alert/custom-alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [MatProgressBarModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = true;

  constructor(
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.DoLogout().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.authService.deleteToken();
          window.location.href = 'login';
          return;
        }

        this.hideMatProgressBar();
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Logout", "Internal server error", ResponseTypeColor.ERROR, null);
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
