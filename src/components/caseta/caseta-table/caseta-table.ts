import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Caseta, EstadoCaseta } from '../../../model/caseta';
import { CasetaService } from '../../../service/caseta-service';

@Component({
  selector: 'app-caseta-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './caseta-table.html',
  styleUrl: './caseta-table.css',
})
export class CasetaTable implements OnInit {
  casetas: Caseta[] = [];
  cdr = inject(ChangeDetectorRef);

  constructor(private casetaService: CasetaService) {}

  ngOnInit(): void {
    this.cargarCasetas();
  }

  cargarCasetas(): void {
    this.casetaService.getAllCasetas().subscribe({
      next: (data) => {
        this.casetas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener las casetas:', err);
      }
    });
  }

  // Obtener clase de badge según el estado
  getBadgeClass(estado?: EstadoCaseta): string {
    switch (estado) {
      case EstadoCaseta.DISPONIBLE:
        return 'bg-success';
      case EstadoCaseta.OCUPADA:
        return 'bg-danger';
      case EstadoCaseta.MANTENIMIENTO:
        return 'bg-warning';
      case EstadoCaseta.RESERVADA:
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  // Obtener texto del estado
  getEstadoTexto(estado?: EstadoCaseta): string {
    return estado || 'Sin estado';
  }
}