import { redirect_to_home } from '../utility/common-utils';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { Component, OnInit, ChangeDetectorRef, inject, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../service/dashboard/dashboard.service';
import { ResponseTypeColor } from '../constants/common-constants';
import { CustomAlertComponent } from '../common-component/custom-alert/custom-alert.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  imports: [MatProgressBarModule, MatDialogModule, RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);
  faChevronDown = faChevronDown;
  is_expanded: boolean = false;

  layout: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) { }

  loadHomePage() {
    if (this.authService.getToken()) {
      redirect_to_home();
    }
  }

  async ngOnInit() {
    try {
      this.activeMatProgressBar();
      this.dashboardService.DoGetMenu().subscribe({
        next: (response) => {
          this.hideMatProgressBar();

          if (response.status === 200) {
            this.layout = response.data;
            console.log(this.layout)
            return;
          }

          this.openDialog("Dashboard", response.message, ResponseTypeColor.ERROR, null);
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, null);
        }
      });
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, null);
    }
  }

  ToggleMenu(menu: any){
    if(menu.parent_id !== -1){
      window.location.href = menu.route_name;
      return;
    }

    menu.is_expanded = !menu.is_expanded;
    this.cdr.detectChanges();
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
