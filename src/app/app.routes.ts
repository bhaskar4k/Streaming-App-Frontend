import { Routes } from "@angular/router";
import { ErrorComponent } from "./error/error.component";
import { LogoutComponent } from "./logout/logout.component";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "./page-component/home/home.component";
import { DashboardComponent } from "./page-component/dashboard/dashboard.component";
import { ProfileComponent } from "./page-component/profile/profile.component";
import { UploadComponent } from "./page-component/upload/upload.component";
import { UploadedVideoComponent } from "./page-component/manage-video/uploaded-video/uploaded-video.component";
import { DeletedVideoComponent } from "./page-component/manage-video/deleted-video/deleted-video.component";
import { EditVideoComponent } from "./page-component/manage-video/edit-video/edit-video.component";
import { WatchVideoComponent } from "./page-component/watch-video/watch-video.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'manage/uploaded-video', component: UploadedVideoComponent },
    { path: 'manage/deleted-video', component: DeletedVideoComponent },
    { path: 'manage/uploaded-video/edit', component: EditVideoComponent },
    { path: 'watch', component: WatchVideoComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: ErrorComponent },
];