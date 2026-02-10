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
  styleUrls: ['./table-solicitud-licencia.css'],
})
export class TableSolicitudLicencia implements OnInit {
  solicitudes: SolicitudLicencia[] = [];
  solicitudesFiltradas: SolicitudLicencia[] = [];

  filtroEstado: EstadoLicencia | null = null;
  filtroAyuntamiento: string = '';

  ayuntamientos: Ayuntamiento[] = [];
  nuevoAyuntamientoId: string = '';

  // Variables para validación
  formSubmitted = false;
  formErrors: { [key: string]: string } = {};

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
        this.showErrorAlert('Error al cargar las solicitudes');
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
        this.showErrorAlert('Error al cargar los ayuntamientos');
      }
    });
  }

  crearSolicitud(): void {
    this.formSubmitted = true;
    this.formErrors = {};

    // Validación del formulario
    if (!this.validarFormulario()) {
      return;
    }

    const ayuntamientoId = Number(this.nuevoAyuntamientoId);

    console.log('Creando solicitud para ayuntamiento ID:', ayuntamientoId);

    // Usar el método que envía solo el ID
    this.solicitudService.saveSolicitudConAyuntamientoId(ayuntamientoId).subscribe({
      next: (respuesta: any) => {
        console.log('✅ Solicitud creada, respuesta:', respuesta);

        // Buscar el ayuntamiento completo en nuestra lista local
        const ayuntamientoCompleto = this.ayuntamientos.find(a => a.id === ayuntamientoId);

        if (!ayuntamientoCompleto) {
          console.warn('Ayuntamiento no encontrado localmente, recargando lista completa...');
          this.cargarSolicitudes(); // Recargar todo
          this.cerrarModal();
          this.showSuccessAlert('Solicitud creada correctamente (recargando lista...)');
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
        this.resetForm();
        this.showSuccessAlert('✅ Solicitud creada correctamente');
      },
      error: (error: any) => {
        console.error('❌ Error creando solicitud:', error);

        let mensajeError = 'Error al crear la solicitud';
        if (error.status === 403) {
          mensajeError = 'No tienes permisos (403 Forbidden). Debes estar logueado como ADMIN.';
        } else if (error.status === 400) {
          mensajeError = 'Error en los datos enviados (400 Bad Request): ' + (error.error?.message || error.error);
        } else if (error.error) {
          mensajeError = `Error: ${error.error.message || error.error}`;
        }

        this.showErrorAlert(mensajeError);
      }
    });
  }

  // Método de validación
  validarFormulario(): boolean {
    let isValid = true;
    this.formErrors = {};

    // Validar ayuntamiento (obligatorio)
    if (!this.nuevoAyuntamientoId || this.nuevoAyuntamientoId === '') {
      this.formErrors['ayuntamiento'] = 'El ayuntamiento es obligatorio';
      isValid = false;
    } else if (isNaN(Number(this.nuevoAyuntamientoId))) {
      this.formErrors['ayuntamiento'] = 'ID de ayuntamiento no válido';
      isValid = false;
    }

    // Validar que el ayuntamiento exista en la lista local (opcional)
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

  // Resetear formulario
  resetForm(): void {
    this.nuevoAyuntamientoId = '';
    this.formSubmitted = false;
    this.formErrors = {};
  }

  // Método para limpiar errores cuando el usuario cambia la selección
  onAyuntamientoChange(): void {
    // Solo limpiar errores si ya se había intentado enviar
    if (this.formSubmitted) {
      // Si el usuario selecciona algo, limpiamos el error específico
      if (this.nuevoAyuntamientoId && this.nuevoAyuntamientoId !== '') {
        delete this.formErrors['ayuntamiento'];

        // Si no hay más errores, podríamos resetear formSubmitted
        // pero mejor lo dejamos así para no perder el estado de "enviado"
      }
    }
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
      case EstadoLicencia.PENDIENTE: return 'badge bg-warning text-dark';
      case EstadoLicencia.APROBADA: return 'badge bg-success text-white';
      case EstadoLicencia.RECHAZADA: return 'badge bg-danger text-white';
      default: return 'badge bg-secondary text-white';
    }
  }

  getNombreAyuntamiento(solicitud: SolicitudLicencia): string {
    return solicitud.ayuntamiento?.nombre || 'N/A';
  }

  // Verificar si el formulario es válido para habilitar/deshabilitar botón
  isFormValid(): boolean {
    if (this.formSubmitted) {
      // !! convierte a booleano explícitamente
      const hasAyuntamientoError = !!this.formErrors['ayuntamiento'];

      return !hasAyuntamientoError &&
        !!this.nuevoAyuntamientoId &&
        this.nuevoAyuntamientoId !== '';
    }
    return true;
  }

  // Métodos para mostrar alertas
  showSuccessAlert(message: string): void {
    alert(message);
  }

  showErrorAlert(message: string): void {
    alert(message);
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
    this.resetForm(); // Resetear formulario al abrir
    const modalElement = document.getElementById('nuevaSolicitudModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}