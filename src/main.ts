import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Import this

import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor])),
    ...appConfig.providers
  ]
}).catch((err) => console.error(err));