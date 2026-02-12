import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const isLoginRequest = req.url.includes('/login');

        if (req.url.includes('/login')) {
          return throwError(() => error);
        }
        if (error.status === 401) {
          console.error('No autorizado - Redirigiendo al login');
          sessionStorage.clear();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          console.error('Acceso denegado - Redirigiendo a Forbidden');
          this.router.navigate(['/forbidden']);
        }

        if (error.status === 500) {
          console.error('Error interno del servidor - 500');
        }

        return throwError(() => error);
      }),
    );
  }
}
