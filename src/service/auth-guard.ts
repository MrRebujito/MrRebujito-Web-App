import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificación de roles si está configurada en la ruta
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles) {
      const userRole = sessionStorage.getItem('rol');
      if (!userRole || !requiredRoles.includes(userRole)) {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    return true;
  }
}