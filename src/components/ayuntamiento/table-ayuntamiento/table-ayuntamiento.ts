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

  constructor(private ayuntamientoService: AyuntamientoService) {

  }

  ngOnInit(): void {
    this.cargarAyuntamientos();
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
    })
  }
  }
