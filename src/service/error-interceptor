import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 403) {
          console.error('Acceso denegado - 403 Forbidden');
          
          this.router.navigate(['/forbidden']);
        }
        
        if (error.status === 401) {
          sessionStorage.clear();
          this.router.navigate(['/login']);
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
}