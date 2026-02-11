import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudLicenciaService } from '../../../service/solicitud-licencia-service';
import { SolicitudLicencia } from '../../../model/solicitud-licencia';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-solicitud-licencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-solicitud-licencia.html',
  styleUrl: './detail-solicitud-licencia.css',
})
export class DetailSolicitudLicencia implements OnInit {
  id!: string;
  solicitudLicencia!: SolicitudLicencia;
  cdr = inject(ChangeDetectorRef);

  constructor(private route: ActivatedRoute, private solicitudService: SolicitudLicenciaService) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this.cargarSolicitudLicencia(Number.parseInt(this.id));
    }
  }

  cargarSolicitudLicencia(id: number): void {
    this.solicitudService.getSolicitudById(id).subscribe({
      next: (data) => {
        this.solicitudLicencia = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getEstadoTexto(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return 'PENDIENTE';
      case 'APROBADA': return 'APROBADA';
      case 'RECHAZADA': return 'RECHAZADA';
      default: return 'DESCONOCIDO';
    }
  }

  volverAtras(): void {
    window.history.back();
  }
}