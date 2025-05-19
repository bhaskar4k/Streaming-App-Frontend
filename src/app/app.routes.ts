import { Routes } from "@angular/router";
import { ErrorComponent } from "./error/error.component";
import { LogoutComponent } from "./logout/logout.component";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";

export const routes: Routes = [
    // { path: '', component: HomeComponent },
    // { path: 'home', component: HomeComponent },
    
    { path: 'login', component: LoginComponent },
    { path: 'home', component: LayoutComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: ErrorComponent },
];