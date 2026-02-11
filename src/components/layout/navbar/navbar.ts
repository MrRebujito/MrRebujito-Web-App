import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ActorService } from '../../../service/actor-service';
import { CommonModule } from '@angular/common';
import { Actor } from '../../../model/actor';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  username: string = '';
  rol: string = '';
  actorId: number | null = null;
  socioId: number | null = null;
  ayuntamientoId: number | null = null;
  casetaId: number | null = null;
  adminId: number | null = null;
  actor: Actor | null = null;

  constructor(
    private actorService: ActorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const storedUsername = sessionStorage.getItem('username');
    const storedRol = sessionStorage.getItem('rol');

    if (storedUsername) {
      this.username = storedUsername;
    }
    if (storedRol) {
      this.rol = storedRol;
    }

    if (this.isLoggedIn()) {
      this.getCurrentActorInfo();
    }
  }

  getCurrentActorInfo(): void {
    this.actorService.actorLogin().subscribe({
      next: (actor: Actor) => {
        this.actor = actor;
        this.rol = actor.rol;
        this.actorId = actor.id;
        sessionStorage.setItem('rol', actor.rol);
        sessionStorage.setItem('actorId', actor.id.toString());
        sessionStorage.setItem('username', actor.username);

        switch (actor.rol) {
          case 'SOCIO':
            this.socioId = actor.id;
            sessionStorage.setItem('socioId', actor.id.toString());
            break;
          case 'AYUNTAMIENTO':
            this.ayuntamientoId = actor.id;
            sessionStorage.setItem('ayuntamientoId', actor.id.toString());
            break;
          case 'CASETA':
            this.casetaId = actor.id;
            sessionStorage.setItem('casetaId', actor.id.toString());
            break;
          case 'ADMIN':
            this.adminId = actor.id;
            sessionStorage.setItem('adminId', actor.id.toString());
            break;
        }
      },
      error: (error) => {
        console.error('Error obteniendo actor:', error);
      }
    });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getUsername(): string {
    return this.username || 'Usuario';
  }

  // ==================== MÉTODOS PARA VERIFICAR ROLES ====================
  isAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  isAyuntamiento(): boolean {
    return this.rol === 'AYUNTAMIENTO';
  }

  isCaseta(): boolean {
    return this.rol === 'CASETA';
  }

  isSocio(): boolean {
    return this.rol === 'SOCIO';
  }

  getRolDisplay(): string {
    const roles: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'AYUNTAMIENTO': 'Ayuntamiento',
      'CASETA': 'Caseta',
      'SOCIO': 'Socio'
    };
    return roles[this.rol] || 'Usuario';
  }

  // ==================== NAVEGACIÓN A PERFILES ====================
  goToProfile(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    switch (this.rol) {
      case 'ADMIN':
        this.navigateToAdminProfile();
        break;
      case 'AYUNTAMIENTO':
        this.navigateToAyuntamientoProfile();
        break;
      case 'SOCIO':
        this.navigateToSocioProfile();
        break;
      case 'CASETA':
        this.navigateToCasetaProfile();
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private navigateToAdminProfile(): void {
    const adminId = sessionStorage.getItem('adminId') || this.adminId;
    if (adminId) {
      this.router.navigate(['/administradores/editar', adminId]);
    } else {
      this.router.navigate(['/administradores']);
    }
  }

  private navigateToAyuntamientoProfile(): void {
    const ayuntamientoId = sessionStorage.getItem('ayuntamientoId') || this.ayuntamientoId;
    if (ayuntamientoId) {
      this.router.navigate(['/ayuntamientos/form', ayuntamientoId]);
    } else {
      this.router.navigate(['/ayuntamientos']);
    }
  }

  private navigateToSocioProfile(): void {
    const socioId = sessionStorage.getItem('socioId') || this.socioId;
    if (socioId) {
      this.router.navigate(['/socios/editar', socioId]);
    } else {
      this.router.navigate(['/socios']);
    }
  }

  private navigateToCasetaProfile(): void {
    const casetaId = sessionStorage.getItem('casetaId') || this.casetaId;
    if (casetaId) {
      this.router.navigate(['/casetas/editar', casetaId]);
    } else {
      this.router.navigate(['/casetas']);
    }
  }

  // ==================== CIERRE DE SESIÓN ====================
  logout(): void {
    // Limpiar todo el sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('actorId');
    sessionStorage.removeItem('socioId');
    sessionStorage.removeItem('ayuntamientoId');
    sessionStorage.removeItem('casetaId');
    sessionStorage.removeItem('adminId');

    // Limpiar propiedades del componente
    this.username = '';
    this.rol = '';
    this.actorId = null;
    this.socioId = null;
    this.ayuntamientoId = null;
    this.casetaId = null;
    this.adminId = null;
    this.actor = null;

    // Redirigir a login y recargar
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  // ==================== OTRAS NAVEGACIONES ====================
  canCreateUsers(): boolean {
    return this.isAdmin();
  }

  goToCreation(): void {
    this.router.navigate(['/administradores/crear-usuario']);
  }

  goToAdminManagement(): void {
    this.router.navigate(['/administradores']);
  }

  goToSolicitudes(): void {
    if (this.isAdmin() || this.isAyuntamiento() || this.isCaseta()) {
      this.router.navigate(['/solicitudes']);
    }
  }
}