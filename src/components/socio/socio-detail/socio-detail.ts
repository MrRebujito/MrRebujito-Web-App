import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SocioService } from '../../../service/socio-service';
import { Socio } from '../../../model/socio';
import { Caseta } from '../../../model/caseta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-socio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './socio-detail.html',
  styleUrl: './socio-detail.css',
})
export class SocioDetail implements OnInit {
  id!: string;
  socio!: Socio;
  casetasDelSocio: Caseta[] = [];

  cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute, 
    private socioService: SocioService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this.cargarSocio(Number.parseInt(this.id));
      

      const rol = sessionStorage.getItem('rol');
      if (rol === 'SOCIO') {
        this.cargarMisCasetas();
      }
    }
  }

  cargarSocio(id: number) {
    this.socioService.getSocio(id).subscribe({
      next: (data: Socio) => {
        this.socio = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar socio:', err)
    });
  }

  cargarMisCasetas() {
    this.socioService.getMisCasetas().subscribe({
      next: (data: Caseta[]) => {
        this.casetasDelSocio = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar mis casetas:', err);
        this.casetasDelSocio = [];
        this.cdr.detectChanges();
      }
    });
  }
}