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
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CustomConfirmDialogComponent } from '../common-component/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-layout',
  imports: [MatProgressBarModule, MatDialogModule, RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [
    trigger('submenuToggle', [
      state('collapsed', style({
        height: '0px',
        overflow: 'hidden',
        opacity: 0
      })),
      state('expanded', style({
        height: '*',
        opacity: 1
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit {
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  faChevronDown = faChevronDown;
  faBars = faBars;
  is_expanded: boolean = false;


  layout: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private dashboardService: DashboardService,
    private router: Router,
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

  OpenCloseMenu() {
    const custom_menu = document.getElementsByClassName('custom_menu');
    const custom_body = document.getElementsByClassName('custom_body');

    const widthCalc = `calc(100vw - 20rem)`;

    if ((custom_menu[0] as HTMLElement).style.width === "18rem") {
      (custom_menu[0] as HTMLElement).style.width = "0px";
      (custom_body[0] as HTMLElement).style.width = "100vw";
    } else {
      (custom_menu[0] as HTMLElement).style.width = "18rem";
      (custom_body[0] as HTMLElement).style.width = widthCalc;
    }
  }

  ResetSelectedMenu(id: string, menu: any) {
    if (id !== menu.id) {
      const item = document.getElementById(`menu_${id}`);
      if (item) {
        item.style.backgroundColor = "#212529";
        item.style.padding = "0rem 0rem";
      }
    }
  };

  ToggleMenu(menu: any) {
    if (menu.parent_id !== -1) {
      this.layout.forEach((element: any) => {
        this.ResetSelectedMenu(element.id, menu);

        if (element.child) {
          element.child.forEach((child: any) => this.ResetSelectedMenu(child.id, menu));
        }
      });

      let item = document.getElementById(`menu_${menu.id}`);
      if (item) {
        item.style.backgroundColor = "var(--bootstrap-bg-dark-light)";
        item.style.padding = "0.5rem 1rem";
      }

      debugger;
      if (menu.route_name === "/logout") {
        const dialogRef = this.dialog.open(CustomConfirmDialogComponent, {
          data: { text: "You are about to logout. Proceed?" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.router.navigate([menu.route_name]);
          }
        });
      } else {
        this.router.navigate([menu.route_name]);
      }

      return;
    }

    menu.is_expanded = !menu.is_expanded;
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    const elements = document.getElementsByClassName('navbar');

    if (elements.length > 0) {
      const height = (elements[0] as HTMLElement).offsetHeight;

      const main_content = document.getElementsByClassName('main_content');
      const custom_menu = document.getElementsByClassName('custom_menu');
      const custom_body = document.getElementsByClassName('custom_body');

      if (main_content.length > 0 && custom_menu.length > 0 && custom_body.length > 0) {
        const heightCalc = `calc(100vh - ${height}px)`;

        (main_content[0] as HTMLElement).style.height = heightCalc;
        (custom_menu[0] as HTMLElement).style.height = heightCalc;
        (custom_body[0] as HTMLElement).style.height = heightCalc;
      }
    }
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
