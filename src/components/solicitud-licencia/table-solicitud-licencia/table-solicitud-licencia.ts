import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudLicenciaService } from '../../../service/solicitud-licencia-service';
import { SolicitudLicencia } from '../../../model/solicitud-licencia';
import { EstadoLicencia } from '../../../model/estado-licencia';
import { RouterModule } from '@angular/router';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';
import { Ayuntamiento } from '../../../model/ayuntamiento';

// Declaración para Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-table-solicitud-licencia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table-solicitud-licencia.html',
  styleUrl: './table-solicitud-licencia.css',
})
export class TableSolicitudLicencia implements OnInit {
  solicitudes: SolicitudLicencia[] = [];
  solicitudesFiltradas: SolicitudLicencia[] = [];

  filtroEstado: EstadoLicencia | null = null;
  filtroAyuntamiento: string = '';

  ayuntamientos: Ayuntamiento[] = [];
  nuevoAyuntamientoId: string = '';

  cdr = inject(ChangeDetectorRef);

  constructor(
    private solicitudService: SolicitudLicenciaService,
    private ayuntamientoService: AyuntamientoService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarAyuntamientos();
      this.cargarSolicitudes();
    });
  }

  cargarSolicitudes(): void {
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

  cargarAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data: Ayuntamiento[]) => {
        this.ayuntamientos = data;
      },
      error: (error) => {
        console.error('Error al cargar ayuntamientos:', error);
      }
    });
  }

  crearSolicitud(): void {
    // Validación básica
    if (!this.nuevoAyuntamientoId || this.nuevoAyuntamientoId === '') {
      alert('❌ Debe seleccionar un ayuntamiento');
      return;
    }

    const ayuntamientoId = Number(this.nuevoAyuntamientoId);

    if (isNaN(ayuntamientoId)) {
      alert('❌ ID de ayuntamiento no válido');
      return;
    }

    console.log('Creando solicitud para ayuntamiento ID:', ayuntamientoId);

    // Usar el NUEVO método que solo envía el ID
    this.solicitudService.saveSolicitudConAyuntamientoId(ayuntamientoId).subscribe({
      next: (respuesta: any) => {
        console.log('✅ Solicitud creada, respuesta:', respuesta);

        // Buscar el ayuntamiento completo en nuestra lista local
        const ayuntamientoCompleto = this.ayuntamientos.find(a => a.id === ayuntamientoId);

        if (!ayuntamientoCompleto) {
          console.warn('Ayuntamiento no encontrado localmente, recargando lista completa...');
          this.cargarSolicitudes(); // Recargar todo
          this.cerrarModal();
          alert('✅ Solicitud creada (recargando lista...)');
          return;
        }

        // Crear objeto completo para mostrar
        const nuevaSolicitudFrontend: SolicitudLicencia = {
          id: respuesta.id || 0,
          estadoLicencia: respuesta.estadoLicencia || EstadoLicencia.PENDIENTE,
          ayuntamiento: ayuntamientoCompleto
        };

        console.log('Añadiendo a lista local:', nuevaSolicitudFrontend);

        // Añadir al principio de la lista
        this.solicitudes.unshift(nuevaSolicitudFrontend);
        this.solicitudesFiltradas = [...this.solicitudes];

        // Forzar actualización de la vista
        this.cdr.detectChanges();

        this.cerrarModal();
        this.nuevoAyuntamientoId = '';
        alert('✅ Solicitud creada correctamente');
      },
      error: (error: any) => {
        console.error('❌ Error creando solicitud:', error);

        let mensajeError = 'Error al crear la solicitud';
        if (error.status === 403) {
          mensajeError = 'No tienes permisos (403 Forbidden). Debes estar logueado como ADMIN.';
        } else if (error.status === 400) {
          mensajeError = 'Error en los datos enviados (400 Bad Request)';
        } else if (error.error) {
          mensajeError = `Error: ${error.error}`;
        }

        alert(`❌ ${mensajeError}`);
      }
    });
  }

  aplicarFiltros(): void {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      const cumpleEstado = !this.filtroEstado || solicitud.estadoLicencia === this.filtroEstado;
      const cumpleAyuntamiento = !this.filtroAyuntamiento || solicitud.ayuntamiento?.nombre === this.filtroAyuntamiento;
      return cumpleEstado && cumpleAyuntamiento;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = null;
    this.filtroAyuntamiento = '';
    this.solicitudesFiltradas = [...this.solicitudes];
  }

  getBadgeClass(estado: EstadoLicencia): string {
    switch (estado) {
      case EstadoLicencia.PENDIENTE: return 'bg-warning text-dark';
      case EstadoLicencia.APROBADA: return 'bg-success';
      case EstadoLicencia.RECHAZADA: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getNombreAyuntamiento(solicitud: SolicitudLicencia): string {
    return solicitud.ayuntamiento?.nombre || 'N/A';
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('nuevaSolicitudModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        const bsModal = new bootstrap.Modal(modalElement);
        bsModal.hide();
      }
    }
  }

  abrirModal(): void {
    this.nuevoAyuntamientoId = '';
    const modalElement = document.getElementById('nuevaSolicitudModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}