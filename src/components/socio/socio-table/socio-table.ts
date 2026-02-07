import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  // Array de socios que alimentará la tabla
  socios: Socio[] = [];

  constructor(private socioService: SocioService) {}

  ngOnInit(): void {
    this.cargarSocios();
  }

  cargarSocios(): void {
    this.socioService.getAllSocios().subscribe({
      next: (data) => {
        this.socios = data;
      },
      error: (err) => {
        console.error('Error al obtener los socios:', err);
      }
    });
  }


  eliminarSocio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este socio?')) {
      this.socioService.deleteSocio(id).subscribe({
        next: () => {
          this.socios = this.socios.filter(s => s.id !== id);
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}