import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Ayuntamiento } from '../../../model/ayuntamiento';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';

@Component({
  selector: 'app-detail-ayuntamiento',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './detail-ayuntamiento.html',
  styleUrl: './detail-ayuntamiento.css',
})
export class DetailAyuntamiento implements OnInit {
  id!: string;
  ayuntamiento!: Ayuntamiento;
  cdr = inject(ChangeDetectorRef);

  constructor (private route: ActivatedRoute, private ayuntamientoService: AyuntamientoService) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this.cargarNoticia(Number.parseInt(this.id))
    }
  }

  cargarNoticia(id: number) {
    this.ayuntamientoService.getAyuntamientoById(id).subscribe({
      next: (data: Ayuntamiento) => {
        this.ayuntamiento = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
