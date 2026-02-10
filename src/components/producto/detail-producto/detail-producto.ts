import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../service/producto-service';

@Component({
  selector: 'app-detail-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-producto.html',
  styleUrls: ['./detail-producto.css']
})
export class DetailProducto implements OnInit {
  
  id: string | null = null;
  producto: Producto | null = null;
  
  // Inyectamos el detector de cambios para forzar la actualización de la vista
  // solo cuando lleguen los datos, evitando bucles.
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.cargarProducto(Number(this.id));
    }
  }

  cargarProducto(id: number): void {
    this.productoService.getProductoById(id).subscribe({ // Asegúrate de tener este método en tu servicio
      next: (data: Producto) => {
        this.producto = data;
        this.cdr.detectChanges(); // Forzamos el renderizado
      },
      error: (error) => {
        console.error('Error al cargar el producto:', error);
      }
    });
  }
}