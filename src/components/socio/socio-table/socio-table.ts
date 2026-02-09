import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Socio } from '../../../model/socio';
import { SocioService } from '../../../service/socio-service';

@Component({
  selector: 'app-socio-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './socio-table.html',
  styleUrl: './socio-table.css',
})
export class SocioTable implements OnInit {
  socios: Socio[] = [];
  cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor(private socioService: SocioService) {}

  ngOnInit(): void {
    this.cargarSocios();
  }

  cargarSocios(): void {
    this.socioService.getAllSocios().subscribe({
      next: (data) => {
        this.socios = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener los socios:', err);
      }
    });
  }

  eliminarMiCuenta(): void { 
    if (confirm('¿Estás seguro de que deseas eliminar TU cuenta? Esta acción no se puede deshacer.')) {
      this.socioService.deleteSocio().subscribe({
        next: (mensaje) => {
          alert(mensaje);
          
          localStorage.removeItem('token'); 
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert("No se pudo eliminar la cuenta. Verifica que estás logueado.");
        }
      });
    }
  }
}