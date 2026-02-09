import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Administrador } from '../../../model/administrador';
import { AdminService } from '../../../service/administrador-service';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-table.html',
  styleUrl: './admin-table.css',
})
export class AdminTable implements OnInit {
  administradores: Administrador[] = [];
  cdr = inject(ChangeDetectorRef);

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.adminService.getAllAdministradores().subscribe({
      next: (data) => {
        this.administradores = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener los administradores:', err);
      }
    });
  }

  eliminarAdministrador(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
      this.adminService.deleteAdministrador(id).subscribe({
        next: () => {
          this.administradores = this.administradores.filter(a => a.id !== id);
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  toggleBaneo(admin: Administrador): void {
    if (admin.baneado) {
      this.adminService.desbanearActor(admin.id).subscribe({
        next: () => {
          admin.baneado = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al desbanear:', err)
      });
    } else {
      this.adminService.banearActor(admin.id).subscribe({
        next: () => {
          admin.baneado = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al banear:', err)
      });
    }
  }
}
