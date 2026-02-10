import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Ayuntamiento } from '../../../model/ayuntamiento';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table-ayuntamiento',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './table-ayuntamiento.html', 
  styleUrl: './table-ayuntamiento.css'      
})

export class TableAyuntamiento implements OnInit {
  
  ayuntamientos: Ayuntamiento[] = [];
  cdr = inject(ChangeDetectorRef);
  ayuntamientoIdSesion: number | null = null;

  constructor(private ayuntamientoService: AyuntamientoService) {}

  ngOnInit(): void {
    this.cargarAyuntamientos();
    
    // obtener el ID del ayuntamiento logueado (si es AYUNTAMIENTO)
    const idSesion = sessionStorage.getItem('ayuntamientoId');
    if (idSesion) {
      this.ayuntamientoIdSesion = parseInt(idSesion);
    }
  }

  cargarAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data) => {
        this.ayuntamientos = data;
        this.cdr.detectChanges();
      },
      error(err) {
        console.error("Error al cargar los ayuntamientos: ", err);
      },
    });
  }

  borrar(id: number): void {
    if (!confirm("¿Estás seguro de que quieres eliminar este ayuntamiento?")) {
      return;
    }

    this.ayuntamientoService.deleteAyuntamiento(id).subscribe({
      next: () => {
        alert("Ayuntamiento eliminado correctamente");
        this.cargarAyuntamientos();
      },
      error: (error) => {
        console.error("Error al borrar el ayuntamiento", error);
        alert("Error al borrar el ayuntamiento");
      }
    });
  }

  esAdmin(): boolean {
    return sessionStorage.getItem('rol') === 'ADMIN';
  }

  esAyuntamiento(): boolean {
    return sessionStorage.getItem('rol') === 'AYUNTAMIENTO';
  }

  // Método para verificar si puede editar/borrar un ayuntamiento específico
  puedeEditarBorrar(ayuntamientoId: number): boolean {
    // si es ADMIN, puede editar/borrar cualquiera
    if (this.esAdmin()) {
      return true;
    }
    
    // si es AYUNTAMIENTO, solo puede editar/borrar el suyo
    if (this.esAyuntamiento() && this.ayuntamientoIdSesion === ayuntamientoId) {
      return true;
    }
    
    return false;
  }
}