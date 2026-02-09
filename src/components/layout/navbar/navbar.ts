import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ActorService } from '../../../service/actor-service';
import { SocioService } from '../../../service/socio-service';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';
import { CommonModule } from '@angular/common';
import { Actor } from '../../../model/actor';
import { Socio } from '../../../model/socio';
import { Ayuntamiento } from '../../../model/ayuntamiento';

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
  actor: Actor | null = null;

  constructor(
    private actorService: ActorService,
    private socioService: SocioService,
    private ayuntamientoService: AyuntamientoService,
    private router: Router
  ) {}

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
        sessionStorage.setItem('rol', actor.rol);
        
        // Obtener ID específico según el rol
        if (actor.rol === 'SOCIO') {
          this.getSocioIdByUsername(actor.username);
        } else if (actor.rol === 'AYUNTAMIENTO') {
          this.getAyuntamientoIdByUsername(actor.username);
        } else if (actor.rol === 'CASETA') {
          this.getCasetaIdByUsername(actor.username);
        }
        // ADMIN no necesita ID específico
      },
      error: (error) => {
        console.error('Error obteniendo actor:', error);
      }
    });
  }

  getSocioIdByUsername(username: string): void {
    // Primero verifica si el actor ya tiene socioId
    if (this.actor && 'socioId' in this.actor) {
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
    if (this.actor && 'ayuntamientoId' in this.actor) {
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
          // Intentar buscar de otra manera si es necesario
        }
      },
      error: (error) => {
        console.error('Error buscando ayuntamiento:', error);
      }
    });
  }

  getCasetaIdByUsername(username: string): void {
    // Implementa cuando tengas el servicio de casetas
    console.log('Buscar caseta para:', username);
    // Similar a los métodos anteriores
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getUsername(): string {
    return this.username || 'Usuario';
  }

  goToProfile(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirección según el rol
    switch (this.rol) {
      case 'ADMIN':
        // Para admin, puedes redirigir a una página de administración
        // o crear un componente AdminProfileComponent
        this.router.navigate(['/solicitudes']); // Redirige a dashboard por ahora
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

  private navigateToAyuntamientoProfile(): void {
    const ayuntamientoId = sessionStorage.getItem('ayuntamientoId');
    
    if (ayuntamientoId) {
      // Ruta correcta según tu app.routes.ts: /ayuntamientos/form/:id
      this.router.navigate(['/ayuntamientos/form', ayuntamientoId]);
    } else {
      // Si no tenemos el ID, buscamos por username
      this.findAyuntamientoAndNavigate();
    }
  }

  private navigateToSocioProfile(): void {
    const socioId = sessionStorage.getItem('socioId');
    
    if (socioId) {
      // Ruta correcta según tu app.routes.ts: /socios/editar/:id
      this.router.navigate(['/socios/editar', socioId]);
    } else {
      this.findSocioAndNavigate();
    }
  }

  private navigateToCasetaProfile(): void {
    const casetaId = sessionStorage.getItem('casetaId');
    
    if (casetaId) {
      // Ajusta la ruta según tengas para casetas
      this.router.navigate(['/casetas/edit', casetaId]);
    } else {
      this.router.navigate(['/casetas']);
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

  logout(): void {
    // Limpiar todo el sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('socioId');
    sessionStorage.removeItem('ayuntamientoId');
    sessionStorage.removeItem('casetaId');
    
    // Limpiar propiedades del componente
    this.username = '';
    this.rol = '';
    this.socioId = null;
    this.ayuntamientoId = null;
    this.actor = null;
    
    // Redirigir a login y recargar
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}