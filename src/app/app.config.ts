import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)

    ,provideHttpClient(withInterceptorsFromDi()), // ✅ Provides HttpClient!
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
