import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CasetaService } from '../../../service/caseta-service';
import { Caseta } from '../../../model/caseta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caseta-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './caseta-detail.html',
  styleUrl: './caseta-detail.css',
})
export class CasetaDetail implements OnInit {
  id!: string;
  caseta!: Caseta;
  cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private casetaService: CasetaService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this.cargarCaseta(Number.parseInt(this.id));
    }
  }

  cargarCaseta(id: number) {
    this.casetaService.getCaseta(id).subscribe({
      next: (data: Caseta) => {
        this.caseta = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la caseta:', err);
      }
    });
  }
}