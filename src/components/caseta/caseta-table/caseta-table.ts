import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Caseta} from '../../../model/caseta';
import { CasetaService } from '../../../service/caseta-service';

@Component({
  selector: 'app-caseta-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './caseta-table.html',
  styleUrl: './caseta-table.css',
})
export class CasetaTable implements OnInit {
  casetas: Caseta[] = [];
  cdr = inject(ChangeDetectorRef);

  constructor(private casetaService: CasetaService) {}

  ngOnInit(): void {
    this.cargarCasetas();
  }

  cargarCasetas(): void {
    this.casetaService.getAllCasetas().subscribe({
      next: (data) => {
        this.casetas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener las casetas:', err);
      }
    });
  }
}