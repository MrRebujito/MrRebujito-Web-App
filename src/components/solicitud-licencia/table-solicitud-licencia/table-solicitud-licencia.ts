import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudLicenciaService } from '../../../service/solicitud-licencia-service';
import { SolicitudLicencia } from '../../../model/solicitud-licencia';

@Component({
  selector: 'app-table-solicitud-licencia',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa FormsModule para ngModel
  templateUrl: './table-solicitud-licencia.html',
  styleUrl: './table-solicitud-licencia.css',
})
export class TableSolicitudLicencia implements OnInit {
  solicitudes: SolicitudLicencia[] = [];
  solicitudesFiltradas: SolicitudLicencia[] = [];
  
  filtroEstado: string = '';
  filtroAyuntamiento: string = '';
  
  ayuntamientos: string[] = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

  constructor(private service: SolicitudLicenciaService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.service.getAllSolicitudLicencia().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.solicitudesFiltradas = [...data];
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      const cumpleEstado = !this.filtroEstado || 
                          solicitud.estadoLicencia === this.filtroEstado;
      const cumpleAyuntamiento = !this.filtroAyuntamiento || 
                                solicitud.ayuntamiento === this.filtroAyuntamiento;
      return cumpleEstado && cumpleAyuntamiento;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroAyuntamiento = '';
    this.solicitudesFiltradas = [...this.solicitudes];
  }

  getBadgeClass(estado: string): string {
    switch(estado?.toUpperCase()) {
      case 'PENDIENTE': return 'bg-warning';
      case 'APROBADA': return 'bg-success';
      case 'RECHAZADA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}