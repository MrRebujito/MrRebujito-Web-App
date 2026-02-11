import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudLicenciaService } from '../../../service/solicitud-licencia-service';
import { SolicitudLicencia } from '../../../model/solicitud-licencia';
import { EstadoLicencia } from '../../../model/estado-licencia';
import { Router, RouterModule } from '@angular/router';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';
import { Ayuntamiento } from '../../../model/ayuntamiento';
import { ActorService } from '../../../service/actor-service';
import { CasetaService } from '../../../service/caseta-service'; // ✅ IMPORTAR
import { Caseta } from '../../../model/caseta'; // ✅ IMPORTAR

declare var bootstrap: any;

@Component({
  selector: 'app-table-solicitud-licencia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table-solicitud-licencia.html',
  styleUrls: ['./table-solicitud-licencia.css'],
})
export class TableSolicitudLicencia implements OnInit {
  
  // ★ Inyectamos el Router para poder redirigir si hay error 403
  private router = inject(Router);
  
  // Servicios inyectados
  private solicitudService = inject(SolicitudLicenciaService);
  private ayuntamientoService = inject(AyuntamientoService);
  private cdr = inject(ChangeDetectorRef);

  solicitudes: SolicitudLicencia[] = [];
  solicitudesFiltradas: SolicitudLicencia[] = [];

  filtroEstado: EstadoLicencia | null = null;

  ayuntamientos: Ayuntamiento[] = [];
  nuevoAyuntamientoId: string = '';

  formSubmitted = false;
  formErrors: { [key: string]: string } = {};

  // Variables de rol
  rolUsuario: string = '';
  idUsuario: number = 0; // ✅ AÑADIR idUsuario
  esAdmin: boolean = false;
  esAyuntamiento: boolean = false;
  esCaseta: boolean = false;
  esSocio: boolean = false;
  
  // ✅ Datos de caseta para rol CASETA
  casetaActual: Caseta | null = null;

  cdr = inject(ChangeDetectorRef);

  constructor(
    private solicitudService: SolicitudLicenciaService,
    private ayuntamientoService: AyuntamientoService,
    private authService: ActorService,
    private casetaService: CasetaService // ✅ INYECTAR
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarioLogueado();
  }

  obtenerUsuarioLogueado(): void {
    this.authService.actorLogin().subscribe({
      next: (actor: any) => {
        console.log('Usuario logueado:', actor);
        this.rolUsuario = actor.rol;
        this.idUsuario = actor.id; // ✅ GUARDAR ID
        
        this.esAdmin = this.rolUsuario === 'ADMIN';
        this.esAyuntamiento = this.rolUsuario === 'AYUNTAMIENTO';
        this.esCaseta = this.rolUsuario === 'CASETA';
        this.esSocio = this.rolUsuario === 'SOCIO';
        
        this.cargarAyuntamientos();
        
        // ✅ SI ES CASETA, CARGAR CASETA COMPLETA
        if (this.esCaseta) {
          this.cargarCasetaCompleta();
        } else {
          this.cargarSolicitudes();
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario logueado:', error);
      }
    });
  }

  // ✅ NUEVO: Cargar caseta completa con solicitudesLicencia
  cargarCasetaCompleta(): void {
    this.casetaService.getCaseta(this.idUsuario).subscribe({
      next: (caseta: Caseta) => {
        this.casetaActual = caseta;
        console.log('Caseta cargada:', caseta);
        console.log('Solicitudes de la caseta:', caseta.solicitudesLicencia);
        
        // Las solicitudes están dentro de caseta.solicitudesLicencia
        this.solicitudes = caseta.solicitudesLicencia || [];
        this.solicitudesFiltradas = [...this.solicitudes];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar la caseta:', error);
        // Fallback: intentar cargar por el método tradicional
        this.cargarSolicitudes();
      }
    });
  }

  cargarSolicitudes(): void {
    if (this.esAyuntamiento) {
      this.solicitudService.getSolicitudesDeMiAyuntamiento().subscribe({
        next: (data: SolicitudLicencia[]) => {
          this.solicitudes = data;
          this.solicitudesFiltradas = [...data];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar solicitudes del ayuntamiento:', error);
        }
      });
    } else if (this.esCaseta && !this.casetaActual) {
      // Solo si no se pudo cargar la caseta completa
      this.solicitudService.getAllSolicitudLicencia().subscribe({
        next: (data: SolicitudLicencia[]) => {
          // Filtrar solicitudes de esta caseta (si hay alguna forma de identificarlas)
          this.solicitudes = data; // Temporal
          this.solicitudesFiltradas = [...this.solicitudes];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar solicitudes:', error);
        }
      });
    } else if (this.esAdmin) {
      this.solicitudService.getAllSolicitudLicencia().subscribe({
        next: (data: SolicitudLicencia[]) => {
          this.solicitudes = data;
          this.solicitudesFiltradas = [...data];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar solicitudes:', error);
        }
      });
    }
  }

  cargarAyuntamientos(): void {
    if (this.esAdmin || this.esCaseta) {
      this.ayuntamientoService.getAyuntamientos().subscribe({
        next: (data: Ayuntamiento[]) => {
          this.ayuntamientos = data;
        },
        error: (error) => {
          console.error('Error al cargar ayuntamientos:', error);
        }
      });
    }
  }

  puedeCrearSolicitudes(): boolean {
    return this.esAdmin || this.esCaseta;
  }

  puedeAceptarRechazar(): boolean {
    return this.esAyuntamiento;
  }

  crearSolicitud(): void {
    if (!this.puedeCrearSolicitudes()) {
      this.showErrorAlert('No tienes permiso para crear solicitudes');
      return;
    }

    this.formSubmitted = true;
    this.formErrors = {};

    if (!this.validarFormulario()) {
      return;
    }

    const ayuntamientoId = Number(this.nuevoAyuntamientoId);

    this.solicitudService.crearSolicitudCaseta(ayuntamientoId).subscribe({
      next: () => {
        this.showSuccessAlert('✅ Solicitud creada correctamente');
        
        // ✅ SI ES CASETA, RECARGAR CASETA COMPLETA
        if (this.esCaseta) {
          this.cargarCasetaCompleta();
        } else {
          this.cargarSolicitudes();
        }
        
        this.cerrarModal();
        this.resetForm();
      },
      error: (error: any) => {
        console.error('❌ Error creando solicitud:', error);
        let mensajeError = 'Error al crear la solicitud';
        
        if (error.status === 403) {
          mensajeError = 'No tienes permisos para crear solicitudes.';
        } else if (error.status === 400) {
          if (error.error?.includes('pendiente') || error.error?.includes('activa')) {
            mensajeError = '❌ Ya tienes una solicitud pendiente o licencia activa con este ayuntamiento.';
          } else {
            mensajeError = 'Error en los datos enviados';
          }
        }
        this.showErrorAlert(mensajeError);
      }
    });
  }

  aceptarSolicitud(id: number): void {
    if (confirm('¿Estás seguro de ACEPTAR esta solicitud?')) {
      this.solicitudService.aceptarSolicitud(id).subscribe({
        next: () => {
          this.showSuccessAlert('✅ Solicitud aceptada');
          this.cargarSolicitudes();
        },
        error: (error) => {
          console.error('❌ Error al aceptar solicitud:', error);
          this.showErrorAlert('Error al aceptar la solicitud');
        }
      });
    }
  }

  rechazarSolicitud(id: number): void {
    if (confirm('¿Estás seguro de RECHAZAR esta solicitud?')) {
      this.solicitudService.rechazarSolicitud(id).subscribe({
        next: () => {
          this.showSuccessAlert('✅ Solicitud rechazada');
          this.cargarSolicitudes();
        },
        error: (error) => {
          console.error('❌ Error al rechazar solicitud:', error);
          this.showErrorAlert('Error al rechazar la solicitud');
        }
      });
    }
  }

  eliminarSolicitud(id: number): void {
    if (!this.esCaseta) {
      this.showErrorAlert('Solo las casetas pueden eliminar solicitudes');
      return;
    }

    if (confirm('¿Estás seguro de eliminar esta solicitud pendiente?')) {
      this.solicitudService.deleteSolicitudLicencia(id).subscribe({
        next: () => {
          this.showSuccessAlert('✅ Solicitud eliminada');
          
          // ✅ SI ES CASETA, RECARGAR CASETA COMPLETA
          if (this.esCaseta) {
            this.cargarCasetaCompleta();
          } else {
            this.cargarSolicitudes();
          }
        },
        error: (error) => {
          console.error('❌ Error al eliminar solicitud:', error);
          this.showErrorAlert('Error al eliminar la solicitud');
        }
      });
    }
  }

  // ✅ CORREGIDO: getMensajeVacio para CASETA
  getMensajeVacio(): string {
    if (this.solicitudes.length === 0) {
      if (this.esAdmin) return 'No hay solicitudes en el sistema';
      if (this.esAyuntamiento) return 'No tienes solicitudes pendientes';
      if (this.esCaseta) return 'No has creado ninguna solicitud. ¡Crea una!';
    }
    return 'No hay solicitudes que coincidan con los filtros';
  }

  // ✅ CORREGIDO: getMensajeInformativo
  getMensajeInformativo(): string {
    if (this.esAdmin) return '👑 Administrador: Puedes ver y gestionar todas las solicitudes.';
    if (this.esAyuntamiento) return '🏛️ Ayuntamiento: Gestiona las solicitudes recibidas. Puedes ACEPTAR o RECHAZAR.';
    if (this.esCaseta) return '🏠 Caseta: Crea nuevas solicitudes y elimina las pendientes.';
    if (this.esSocio) return '👤 Socio: No tienes acceso a solicitudes.';
    return '';
  }

  // ✅ El resto de métodos se quedan IGUAL
  getAlertClass(): string {
    if (this.esAdmin) return 'alert-primary';
    if (this.esAyuntamiento) return 'alert-info';
    if (this.esCaseta) return 'alert-success';
    return 'alert-warning';
  }

  getAlertIcon(): string {
    if (this.esAdmin) return 'bi-shield-shaded';
    if (this.esAyuntamiento) return 'bi-building';
    if (this.esCaseta) return 'bi-house';
    return 'bi-person';
  }

  getRolBadgeClass(): string {
    if (this.esAdmin) return 'badge bg-danger';
    if (this.esAyuntamiento) return 'badge bg-info';
    if (this.esCaseta) return 'badge bg-success';
    return 'badge bg-secondary';
  }

  getRolIcon(): string {
    if (this.esAdmin) return 'bi-shield-lock';
    if (this.esAyuntamiento) return 'bi-building';
    if (this.esCaseta) return 'bi-house-door';
    return 'bi-person';
  }

  getRolNombre(): string {
    if (this.esAdmin) return 'ADMIN';
    if (this.esAyuntamiento) return 'AYUNTAMIENTO';
    if (this.esCaseta) return 'CASETA';
    if (this.esSocio) return 'SOCIO';
    return this.rolUsuario || 'INVITADO';
  }

  validarFormulario(): boolean {
    let isValid = true;
    this.formErrors = {};

    if (!this.nuevoAyuntamientoId || this.nuevoAyuntamientoId === '') {
      this.formErrors['ayuntamiento'] = 'El ayuntamiento es obligatorio';
      isValid = false;
    } else if (isNaN(Number(this.nuevoAyuntamientoId))) {
      this.formErrors['ayuntamiento'] = 'ID de ayuntamiento no válido';
      isValid = false;
    }

    if (this.nuevoAyuntamientoId && !isNaN(Number(this.nuevoAyuntamientoId))) {
      const id = Number(this.nuevoAyuntamientoId);
      const ayuntamientoExists = this.ayuntamientos.some(a => a.id === id);
      if (!ayuntamientoExists) {
        this.formErrors['ayuntamiento'] = 'El ayuntamiento seleccionado no es válido';
        isValid = false;
      }
    }

    return isValid;
  }

  resetForm(): void {
    this.nuevoAyuntamientoId = '';
    this.formSubmitted = false;
    this.formErrors = {};
  }

  onAyuntamientoChange(): void {
    if (this.formSubmitted && this.nuevoAyuntamientoId && this.nuevoAyuntamientoId !== '') {
      delete this.formErrors['ayuntamiento'];
    }
  }

  aplicarFiltros(): void {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      return !this.filtroEstado || solicitud.estadoLicencia === this.filtroEstado;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = null;
    this.solicitudesFiltradas = [...this.solicitudes];
  }

  getBadgeClass(estado: EstadoLicencia): string {
    switch (estado) {
      case EstadoLicencia.PENDIENTE: return 'badge bg-warning text-dark';
      case EstadoLicencia.APROBADA: return 'badge bg-success';
      case EstadoLicencia.RECHAZADA: return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getNombreAyuntamiento(solicitud: SolicitudLicencia): string {
    return solicitud.ayuntamiento?.nombre || 'N/A';
  }

  isFormValid(): boolean {
    if (this.formSubmitted) {
      return !this.formErrors['ayuntamiento'] && 
             !!this.nuevoAyuntamientoId && 
             this.nuevoAyuntamientoId !== '';
    }
    return true;
  }

  showSuccessAlert(message: string): void { alert(message); }
  showErrorAlert(message: string): void { alert(message); }

  cerrarModal(): void {
    const modalElement = document.getElementById('nuevaSolicitudModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
      else new bootstrap.Modal(modalElement).hide();
    }
  }

  abrirModal(): void {
    if (this.puedeCrearSolicitudes()) {
      this.resetForm();
      const modalElement = document.getElementById('nuevaSolicitudModal');
      if (modalElement) new bootstrap.Modal(modalElement).show();
    }
  }
}