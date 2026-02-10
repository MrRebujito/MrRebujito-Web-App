import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CasetaService } from '../../../service/caseta-service';
import { SocioService } from '../../../service/socio-service';
import { Socio } from '../../../model/socio';
import { Caseta } from '../../../model/caseta';

@Component({
  selector: 'app-caseta-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caseta-socios.html',
  styleUrl: './caseta-socios.css'
})
export class CasetaSocios implements OnInit {
  casetaId!: number;
  caseta!: Caseta;
  sociosDisponibles: Socio[] = [];
  sociosAsignados: Socio[] = [];
  socioSeleccionadoId: number | null = null;
  
  cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casetaService: CasetaService,
    private socioService: SocioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.casetaId = Number(id);
      this.cargarDatos();
    }
  }

  cargarDatos(): void {
    // Cargar caseta
    this.casetaService.getCaseta(this.casetaId).subscribe({
      next: (data) => {
        this.caseta = data;
        this.sociosAsignados = data.socios || [];
        this.cargarSociosDisponibles();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar caseta:', err)
    });
  }

  cargarSociosDisponibles(): void {
    /*this.socioService.findAll().subscribe({
      next: (todosSocios: any[]) => {
        // Filtrar socios que NO están ya asignados
        const idsAsignados = this.sociosAsignados.map(s => s.id);
        this.sociosDisponibles = todosSocios.filter(
          (          socio: { id: number; }) => !idsAsignados.includes(socio.id)
        );
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar socios:', err)
    });*/
  }

  agregarSocio(): void {
    if (!this.socioSeleccionadoId) {
      alert('Por favor seleccione un socio');
      return;
    }

    // Validar aforo
    if (this.sociosAsignados.length >= this.caseta.aforo) {
      alert(`No se puede añadir más socios. Aforo máximo: ${this.caseta.aforo}`);
      return;
    }

    this.casetaService.addSocioToCaseta(this.socioSeleccionadoId).subscribe({
      next: () => {
        alert('Socio agregado correctamente');
        this.socioSeleccionadoId = null;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al agregar socio:', err);
        alert('Error al agregar el socio. Puede que ya esté en la caseta o se haya alcanzado el aforo máximo.');
      }
    });
  }

  eliminarSocio(socioId: number): void {
    if (!confirm('¿Está seguro de eliminar este socio de la caseta?')) {
      return;
    }

    this.casetaService.removeSocioFromCaseta(socioId).subscribe({
      next: () => {
        alert('Socio eliminado correctamente');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al eliminar socio:', err);
        alert('Error al eliminar el socio');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/casetas', this.casetaId]);
  }
}