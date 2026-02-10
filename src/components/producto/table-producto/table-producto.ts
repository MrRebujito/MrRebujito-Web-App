import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../service/producto-service';
import { Producto } from '../../../model/producto';

@Component({
  selector: 'app-table-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './table-producto.html',
  styleUrls: ['./table-producto.css']
})
export class TableProducto implements OnInit {

  productos: Producto[] = [];
  // Inyectamos el detector de cambios manualmente como en tu ejemplo de Ayuntamiento
  cdr = inject(ChangeDetectorRef);
  
  // Variables de sesión por si necesitas filtrar permisos
  rol: string | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Obtener rol de sesión al inicio
    this.rol = sessionStorage.getItem('rol');
    
    // 2. Cargar datos
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        // Forzamos la detección de cambios para evitar el "flicker" o bucles raros
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Error al cargar los productos: ", err);
      }
    });
  }

  crearProducto(): void {
    this.router.navigate(['/producto/create']);
  }

  borrarProducto(id: number): void {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        // No usamos alert() si no quieres, pero aquí seguimos tu patrón
        // alert("Producto eliminado correctamente"); 
        this.cargarProductos();
      },
      error: (error) => {
        console.error("Error al borrar el producto", error);
        alert("No se pudo eliminar el producto.");
      }
    });
  }

  // --- Helpers de Permisos (Estilo Ayuntamiento) ---

  esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  // Ejemplo: Si quisieras restringir botones según rol
  puedeEditar(): boolean {
    // Aquí defines tu lógica. Por ahora devolvemos true si está logueado
    return this.rol !== null;
  }
}