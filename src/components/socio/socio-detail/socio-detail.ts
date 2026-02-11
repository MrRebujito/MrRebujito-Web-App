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
  id: string | null = null;
  socio!: Socio; // Variable donde guardamos los datos para el HTML
  
  cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute, 
    private socioService: SocioService
  ) {
    // Intentamos capturar el ID de la URL
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      // Si hay ID en la URL, cargamos ese socio específico
      this.cargarSocio(Number.parseInt(this.id));
    } else {
      // Si NO hay ID, es que el socio ha pulsado "Mi Perfil"
      this.cargarMiPropioPerfil();
    }
  }

  cargarSocio(id: number) {
    this.socioService.getSocio(id).subscribe({
      next: (data: Socio) => {
        this.socio = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar socio por ID:', err);
      }
    });
  }

  cargarMiPropioPerfil() {
    this.socioService.getPerfilLogueado().subscribe({
      next: (data: Socio) => {
        this.socio = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar perfil logueado:', err);
      }
    });
  }
}