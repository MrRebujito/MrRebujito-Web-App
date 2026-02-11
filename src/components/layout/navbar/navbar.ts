import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ActorService } from '../../../service/actor-service';
import { SocioService } from '../../../service/socio-service';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';
import { CasetaService } from '../../../service/caseta-service'; // ✅ IMPORTAR
import { CommonModule } from '@angular/common';
import { Actor } from '../../../model/actor';
import { Socio } from '../../../model/socio';
import { Ayuntamiento } from '../../../model/ayuntamiento';
import { Caseta } from '../../../model/caseta'; // ✅ IMPORTAR

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
    private socioService: SocioService,
    private ayuntamientoService: AyuntamientoService,
    private casetaService: CasetaService,
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

        // Obtener ID específico según el rol
        if (actor.rol === 'SOCIO') {
          this.getSocioIdByUsername(actor.username);
        } else if (actor.rol === 'AYUNTAMIENTO') {
          this.getAyuntamientoIdByUsername(actor.username);
        } else if (actor.rol === 'CASETA') {
          this.getCasetaIdByUsername(actor.username);
        } else if (actor.rol === 'ADMIN') {
          this.getAdminId(actor.id); 
        }
      },
      error: (error) => {
        console.error('Error obteniendo actor:', error);
      }
    });
  }

  getSocioIdByUsername(username: string): void {
    // Primero verifica si el actor ya tiene socioId
    if (this.actor && (this.actor as any).socioId) {
      this.socioId = (this.actor as any).socioId;
      sessionStorage.setItem('socioId', this.socioId!.toString());
      return;
    }

    // Buscar en la lista de socios
    this.socioService.getAllSocios().subscribe({
      next: (socios: Socio[]) => {
        const socio = socios.find(s => s.username === username);
        if (socio) {
          this.socioId = socio.id;
          sessionStorage.setItem('socioId', socio.id.toString());
        } else {
          console.warn('No se encontró socio para el username:', username);
        }
      },
      error: (error) => {
        console.error('Error buscando socio:', error);
      }
    });
  }

  getAyuntamientoIdByUsername(username: string): void {
    // Primero verifica si el actor ya tiene ayuntamientoId
    if (this.actor && (this.actor as any).ayuntamientoId) {
      this.ayuntamientoId = (this.actor as any).ayuntamientoId;
      sessionStorage.setItem('ayuntamientoId', this.ayuntamientoId!.toString());
      return;
    }

    // Buscar en la lista de ayuntamientos usando getAyuntamientos()
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (ayuntamientos: Ayuntamiento[]) => {
        const ayuntamiento = ayuntamientos.find(a => a.username === username);
        if (ayuntamiento) {
          this.ayuntamientoId = ayuntamiento.id;
          sessionStorage.setItem('ayuntamientoId', ayuntamiento.id.toString());
        } else {
          console.warn('No se encontró ayuntamiento para el username:', username);
        }
      },
      error: (error) => {
        console.error('Error buscando ayuntamiento:', error);
      }
    });
  }

  getCasetaIdByUsername(username: string): void {
    // Primero verifica si el actor ya tiene casetaId
    if (this.actor && (this.actor as any).casetaId) {
      this.casetaId = (this.actor as any).casetaId;
      sessionStorage.setItem('casetaId', this.casetaId!.toString());
      return;
    }

    // Buscar en la lista de casetas
    this.casetaService.getAllCasetas().subscribe({
      next: (casetas: Caseta[]) => {
        const caseta = casetas.find(c => c.username === username);
        if (caseta) {
          this.casetaId = caseta.id;
          sessionStorage.setItem('casetaId', caseta.id.toString());
          console.log('Caseta encontrada ID:', caseta.id);
        } else {
          console.warn('No se encontró caseta para el username:', username);
        }
      },
      error: (error) => {
        console.error('Error buscando caseta:', error);
      }
    });
  }

  // ✅ NUEVO: Obtener ID de admin
  getAdminId(id: number): void {
    this.adminId = id;
    sessionStorage.setItem('adminId', id.toString());
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

  goToProfile(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirección según el rol
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
      // Ruta para editar administrador
      this.router.navigate(['/administradores/editar', adminId]);
    } else {
      // Si no tenemos ID, usar el del actor logueado
      if (this.actorId) {
        this.router.navigate(['/administradores/editar', this.actorId]);
      } else {
        this.router.navigate(['/administradores']);
      }
    }
  }

  private navigateToAyuntamientoProfile(): void {
    const ayuntamientoId = sessionStorage.getItem('ayuntamientoId') || this.ayuntamientoId;

    if (ayuntamientoId) {
      // Ruta correcta según tu app.routes.ts: /ayuntamientos/form/:id
      this.router.navigate(['/ayuntamientos/form', ayuntamientoId]);
    } else {
      // Si no tenemos el ID, buscamos por username
      this.findAyuntamientoAndNavigate();
    }
  }

  private navigateToSocioProfile(): void {
    const socioId = sessionStorage.getItem('socioId') || this.socioId;

    if (socioId) {
      // Ruta correcta según tu app.routes.ts: /socios/editar/:id
      this.router.navigate(['/socios/editar', socioId]);
    } else {
      this.findSocioAndNavigate();
    }
  }

  private navigateToCasetaProfile(): void {
    const casetaId = sessionStorage.getItem('casetaId') || this.casetaId;

    if (casetaId) {
      // Ruta: /casetas/editar/:id
      this.router.navigate(['/casetas/editar', casetaId]);
    } else {
      this.findCasetaAndNavigate();
    }
  }

  findAyuntamientoAndNavigate(): void {
    if (!this.username) {
      this.router.navigate(['/ayuntamientos']);
      return;
    }

    // Buscar ayuntamiento por username
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (ayuntamientos: Ayuntamiento[]) => {
        const ayuntamiento = ayuntamientos.find(a => a.username === this.username);
        if (ayuntamiento) {
          // Guardar el ID para futuras navegaciones
          sessionStorage.setItem('ayuntamientoId', ayuntamiento.id.toString());
          this.router.navigate(['/ayuntamientos/form', ayuntamiento.id]);
        } else {
          console.warn('Ayuntamiento no encontrado, redirigiendo a lista');
          this.router.navigate(['/ayuntamientos']);
        }
      },
      error: (error) => {
        console.error('Error buscando ayuntamiento:', error);
        this.router.navigate(['/ayuntamientos']);
      }
    });
  }

  findSocioAndNavigate(): void {
    if (!this.username) {
      this.router.navigate(['/socios']);
      return;
    }

    this.socioService.getAllSocios().subscribe({
      next: (socios: Socio[]) => {
        const socio = socios.find(s => s.username === this.username);
        if (socio) {
          // Guardar el ID para futuras navegaciones
          sessionStorage.setItem('socioId', socio.id.toString());
          this.router.navigate(['/socios/editar', socio.id]);
        } else {
          console.warn('Socio no encontrado, redirigiendo a lista');
          this.router.navigate(['/socios']);
        }
      },
      error: (error) => {
        console.error('Error buscando socio:', error);
        this.router.navigate(['/socios']);
      }
    });
  }

  findCasetaAndNavigate(): void {
    if (!this.username) {
      this.router.navigate(['/casetas']);
      return;
    }

    this.casetaService.getAllCasetas().subscribe({
      next: (casetas: Caseta[]) => {
        const caseta = casetas.find(c => c.username === this.username);
        if (caseta) {
          sessionStorage.setItem('casetaId', caseta.id.toString());
          this.router.navigate(['/casetas/editar', caseta.id]);
        } else {
          console.warn('Caseta no encontrada, redirigiendo a lista');
          this.router.navigate(['/casetas']);
        }
      },
      error: (error) => {
        console.error('Error buscando caseta:', error);
        this.router.navigate(['/casetas']);
      }
    });
  }

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

  // Verificar si puede crear usuarios (solo ADMIN)
  canCreateUsers(): boolean {
    return this.isAdmin();
  }

  // Navegar a creación de usuarios
  goToCreation(): void {
    this.router.navigate(['/administradores/crear-usuario']);
  }

  // Navegar a gestión de administradores
  goToAdminManagement(): void {
    this.router.navigate(['/administradores']);
  }

  // Navegar a solicitudes de licencia según rol
  goToSolicitudes(): void {
    if (this.isAdmin() || this.isAyuntamiento() || this.isCaseta()) {
      this.router.navigate(['/solicitudes']);
    }
  }
}