import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudLicenciaService } from '../../../service/solicitud-licencia-service';
import { SolicitudLicencia } from '../../../model/solicitud-licencia';
import { EstadoLicencia } from '../../../model/estado-licencia';
import { RouterModule } from '@angular/router';

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

  ayuntamientos: string[] = [];

  // Inyección del ChangeDetectorRef para forzar detección de cambios
  cdr = inject(ChangeDetectorRef);

  constructor(private service: SolicitudLicenciaService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.service.getAllSolicitudLicencia().subscribe({
      next: (data: SolicitudLicencia[]) => {
        this.solicitudes = data;
        this.solicitudesFiltradas = [...data];

        // Extraer lista única de ayuntamientos
        this.ayuntamientos = [
          ...new Set(data.map(s => s.ayuntamiento.nombre))
        ].sort();

        // Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (error: string) => {
        console.error('Error al cargar solicitudes:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      const cumpleEstado =
        this.filtroEstado == null ||
        solicitud.estadoLicencia === this.filtroEstado;

      const cumpleAyuntamiento =
        !this.filtroAyuntamiento ||
        solicitud.ayuntamiento.nombre === this.filtroAyuntamiento;

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
      case EstadoLicencia.PENDIENTE:
        return 'bg-warning text-dark';
      case EstadoLicencia.APROBADA:
        return 'bg-success';
      case EstadoLicencia.RECHAZADA:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }


  // Método auxiliar para obtener el nombre del ayuntamiento
  getNombreAyuntamiento(solicitud: SolicitudLicencia): string {
    return solicitud.ayuntamiento?.nombre || 'N/A';
  }
}