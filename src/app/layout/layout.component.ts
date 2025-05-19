import { redirect_to_home } from '../utility/common-utils';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { Component, OnInit, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../service/dashboard/dashboard.service';
import { ResponseTypeColor } from '../constants/common-constants';
import { GenerateMenu } from '../utility/menu-generator';
import { CustomAlertComponent } from '../common-component/custom-alert/custom-alert.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [MatProgressBarModule, MatDialogModule, RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  windowWidth = window.innerWidth;
  previousWindowWidth = window.innerWidth;
  toogleStatus = 0;
  elements: any[] = [];
  layout: any[] = [];

  iconMap: { [key: string]: string } = {
    home: 'assets/images/home.svg',
    dashboard: 'assets/images/dashboard.svg',
    upload: 'assets/images/upload.svg',
    profile: 'assets/images/profile.svg',
    logout: 'assets/images/logout.svg',
    manage: 'assets/images/manage.svg',
    uploaded_video: 'assets/images/uploaded_video.svg',
    deleted_video: 'assets/images/delete.svg',
    down_arrow: 'assets/images/down_arrow.svg'
  };

  constructor(
    private authService: AuthenticationService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  loadHomePage() {
    if (this.authService.getToken()) {
      redirect_to_home();
    }
  }

  ngOnInit(): void {
    this.getLeftSideMenu();
  }

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
    // this.adjustLayout();
  }

  async getLeftSideMenu() {
    try {
      this.activeMatProgressBar();
      this.dashboardService.DoGetMenu().subscribe({
        next: (response) => {
          this.hideMatProgressBar();

          if (response.status === 200) {
            this.layout = response.data;

            this.elements = response.data.map((item: any) => ({
              id: item.id,
              menu_name_id: item.menu_name_id
            }));

            const rootMenu = document.getElementById('root_menu');
            if (rootMenu) {
              rootMenu.innerHTML = GenerateMenu(response.data, this.iconMap);
            }
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

  toggleSidebar(id: any, parent_id: any, route: string) {
    // if (parent_id !== -1) navigate(route);

    //     const subMenuParent = document.getElementById(`submenu-${id}`);
    //     const subMenuToggleIcon = document.getElementById(`toggle-${id}`);
    //     const subMenus = document.getElementsByClassName('a-menu-item-child');

    //     if (subMenuParent.style.maxHeight && subMenuParent.style.maxHeight !== "0px") {
    //         subMenuParent.style.maxHeight = "0px";
    //         subMenuToggleIcon.style.transform = "rotate(0deg)";
    //     } else {
    //         subMenuParent.style.maxHeight = subMenuParent.scrollHeight + "px";
    //         subMenuToggleIcon.style.transform = "rotate(180deg)";
    //     }

    //     let subMenuMarginLeft = (document.getElementById('menubar').style.width === '70px') ? "0px" : "20px";

    //     for (let i = 0; i < subMenus.length; i++) {
    //         subMenus[i].style.marginLeft = subMenuMarginLeft;
    //     }
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
