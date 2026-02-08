import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SocioService } from '../../../service/socio-service';
import { Socio } from '../../../model/socio';
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
  cdr = inject(ChangeDetectorRef);

  constructor(private route: ActivatedRoute, private socioService: SocioService) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this.cargarSocio(Number.parseInt(this.id));
    }
  }

  cargarSocio(id: number) {

    // Llamamos al método del servicio pasándole el ID que capturamos de la URL
    this.socioService.getSocio(id).subscribe({

      // 'next' se ejecuta cuando el servidor (Spring) responde con éxito (HTTP 200)
      next: (data: Socio) => {

        // 1. Guardamos el JSON que nos envía el backend en nuestra variable local 'socio'
        this.socio = data;

        // 2. CDR (Change Detector Ref) - Forzamos a Angular a revisar la pantalla
        this.cdr.detectChanges();
      },

      // 'error' se ejecuta si algo sale mal
      error: (err) => {
        console.error('El servidor ha respondido con un error:', err);
      }
    });

  }
}