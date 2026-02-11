import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from '../service/jwtinterceptor';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 403) {
        console.error('Acceso denegado - 403 Forbidden');
        
        const mensaje = error.error?.message || error.error || 'No tienes permisos para acceder a este recurso';
        sessionStorage.setItem('forbiddenMessage', mensaje);
        
        router.navigate(['/forbidden']);
      }
      
      if (error.status === 401) {
        console.warn('Sesión expirada o no autenticado - 401');
        sessionStorage.clear();
        router.navigate(['/login']);
      }
      
      if (error.status === 404) {
        console.error('Recurso no encontrado - 404');
      }
      
      if (error.status === 500) {
        console.error('Error interno del servidor - 500');
      }
      
      return throwError(() => error);
    })
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        errorInterceptor
      ])
    )
  ]
};