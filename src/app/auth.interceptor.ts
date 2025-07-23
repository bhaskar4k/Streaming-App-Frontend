import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './service/authentication/authentication.service';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { CustomAlertComponent } from './common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseTypeColor } from './constants/common-constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const token = authService.getToken();
  const dialog = inject(MatDialog)

  const clonedRequest = token
    ? req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        openDialog('Logout', error.error.message, ResponseTypeColor.ERROR, "login");
        return EMPTY;
      }

      return throwError(() => error);
    })
  );

  function openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        if (navigateRoute === "login") {
          authService.deleteToken();
          window.location.href = navigateRoute;
        }
      }
    });
  }
};
