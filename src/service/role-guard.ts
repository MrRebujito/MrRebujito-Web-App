import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificación de roles obligatoria
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = sessionStorage.getItem('rol');
      if (!userRole || !requiredRoles.includes(userRole)) {
        alert('No tienes permisos para acceder a esta sección.');
        this.router.navigate(['/solicitudes']);
        return false;
      }
    }

    return true;
  }
}
