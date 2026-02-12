import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Caseta } from '../../../model/caseta';
import { CasetaService } from '../../../service/caseta-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-caseta-table',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './caseta-table.html',
  styleUrl: './caseta-table.css',
})
export class CasetaTable implements OnInit {
  casetas: Caseta[] = [];
  
  //Variables para los filtros
  casetasFiltradas: Caseta[] = []; // Esta es la lista que se pintará en la tabla
  textoBusqueda: string = '';      // Aquí se guarda lo que escribe el usuario

  cdr = inject(ChangeDetectorRef);
  rol: string | null = null;

  constructor(private casetaService: CasetaService) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
    this.cargarCasetas();
  }

  cargarCasetas(): void {
    this.casetaService.getAllCasetas().subscribe({
      next: (data) => {
        this.casetas = data;
        
        //Inicializar la lista con todas las casetas
        this.casetasFiltradas = data; 
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener las casetas:', err);
      }
    });
  }

  //Función para el filtrado de los socios
  filtrar(): void {
    // Si no han escrito nada, mostramos todas las casetas originales
    if (!this.textoBusqueda) {
      this.casetasFiltradas = this.casetas;
      return;
    }

    const busqueda = this.textoBusqueda.toLowerCase();

    // Filtramos la lista original y guardamos el resultado en la lista filtrada
    this.casetasFiltradas = this.casetas.filter(caseta => {
      if (!caseta.socios || caseta.socios.length === 0) {
        return false;
      }

      // Buscamos si algun socio coincide con el texto que se ha metido
      return caseta.socios.some(socio => 
        (socio.nombre && socio.nombre.toLowerCase().includes(busqueda)) ||
        (socio.primerApellido && socio.primerApellido.toLowerCase().includes(busqueda)) ||
        (socio.username && socio.username.toLowerCase().includes(busqueda))
      );
    });
  }
}