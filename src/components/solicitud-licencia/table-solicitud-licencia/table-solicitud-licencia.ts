import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudLicenciaService } from '../../../service/solicitud-licencia-service';
import { SolicitudLicencia } from '../../../model/solicitud-licencia';
import { EstadoLicencia } from '../../../model/estado-licencia';
import { Router, RouterModule } from '@angular/router';
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
  
  // ★ Inyectamos el Router para poder redirigir si hay error 403
  private router = inject(Router);
  
  // Servicios inyectados
  private solicitudService = inject(SolicitudLicenciaService);
  private ayuntamientoService = inject(AyuntamientoService);
  private cdr = inject(ChangeDetectorRef);

  solicitudes: SolicitudLicencia[] = [];
  solicitudesFiltradas: SolicitudLicencia[] = [];

  filtroEstado: EstadoLicencia | null = null;
  filtroAyuntamiento: string = '';

  ayuntamientos: Ayuntamiento[] = [];
  nuevoAyuntamientoId: string = '';

  formSubmitted = false;
  formErrors: { [key: string]: string } = {};

  ngOnInit(): void {
    // Carga inicial de datos
    this.cargarAyuntamientos();
    this.cargarSolicitudes();
  }

  // ★ CORREGIDO: Método extraído para poder reutilizarlo
  cargarSolicitudes(): void {
    this.solicitudService.getAllSolicitudLicencia().subscribe({
      next: (data) => {
        // Si todo va bien, cargamos los datos
        this.solicitudes = data;
        // Aplicamos filtros por si había alguno seleccionado
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
        this.router.navigate(['/forbidden']);
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

        // Buscar el ayuntamiento completo en nuestra lista local para mostrarlo sin recargar todo
        const ayuntamientoCompleto = this.ayuntamientos.find(a => a.id === ayuntamientoId);

        if (!ayuntamientoCompleto) {
          console.warn('Ayuntamiento no encontrado localmente, recargando lista completa...');
          // ★ CORREGIDO: Llamada limpia al método sin errores de sintaxis
          this.cargarSolicitudes(); 
          this.cerrarModal();
          this.showSuccessAlert('Solicitud creada correctamente (recargando lista...)');
          return;
        }

        // Crear objeto completo para mostrar en la tabla inmediatamente (Optimistic UI)
        const nuevaSolicitudFrontend: SolicitudLicencia = {
          id: respuesta.id || 0,
          estadoLicencia: respuesta.estado || EstadoLicencia.PENDIENTE, // Aseguramos que mapee bien el campo 'estado' o 'estadoLicencia' según tu backend
          ayuntamiento: ayuntamientoCompleto,
        };

        console.log('Añadiendo a lista local:', nuevaSolicitudFrontend);

        // Añadir al principio de la lista
        this.solicitudes.unshift(nuevaSolicitudFrontend);
        // Actualizar la lista filtrada
        this.aplicarFiltros();

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
          mensajeError = 'No tienes permisos para crear solicitudes. Debes ser ADMIN o CASETA.';
        } else if (error.status === 400) {
          mensajeError = 'Error en los datos (400): ' + (error.error?.message || 'Datos inválidos');
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
    if (this.formSubmitted) {
      if (this.nuevoAyuntamientoId && this.nuevoAyuntamientoId !== '') {
        delete this.formErrors['ayuntamiento'];
      }
    }
  }

  aplicarFiltros(): void {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      // Ajusta 'estado' o 'estadoLicencia' según tu modelo exacto
      const estadoReal = solicitud.estadoLicencia || solicitud.estadoLicencia; 
      
      const cumpleEstado = !this.filtroEstado || estadoReal === this.filtroEstado;
      const cumpleAyuntamiento = !this.filtroAyuntamiento || solicitud.ayuntamiento?.nombre === this.filtroAyuntamiento;
      
      return cumpleEstado && cumpleAyuntamiento;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = null;
    this.filtroAyuntamiento = '';
    this.solicitudesFiltradas = [...this.solicitudes];
  }

  getBadgeClass(estado: EstadoLicencia | string): string {
    // Convertimos a string por seguridad
    const estadoStr = estado.toString();
    
    if (estadoStr === 'PENDIENTE') return 'badge bg-warning text-dark';
    if (estadoStr === 'ACEPTADA' || estadoStr === 'APROBADA') return 'badge bg-success text-white';
    if (estadoStr === 'RECHAZADA') return 'badge bg-danger text-white';
    
    return 'badge bg-secondary text-white';
  }

  getNombreAyuntamiento(solicitud: SolicitudLicencia): string {
    return solicitud.ayuntamiento?.nombre || 'N/A';
  }

  isFormValid(): boolean {
    if (this.formSubmitted) {
      const hasAyuntamientoError = !!this.formErrors['ayuntamiento'];
      return !hasAyuntamientoError && !!this.nuevoAyuntamientoId;
    }
    return true;
  }

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
    this.resetForm(); 
    const modalElement = document.getElementById('nuevaSolicitudModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}