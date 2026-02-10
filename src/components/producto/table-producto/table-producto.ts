import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../service/producto-service';
import { Producto } from '../../../model/producto';

@Component({
  selector: 'app-table-producto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './table-producto.html',
  styleUrls: ['./table-producto.css']
})
export class TableProducto implements OnInit {

  // Todos los datos del servidor
  productos: Producto[] = [];
  // Los datos que realmente mostramos tras filtrar
  productosFiltrados: Producto[] = [];
  
  cdr = inject(ChangeDetectorRef);
  rol: string | null = null;

  // Variables para los filtros
  filtroNombre: string = '';
  filtroTipo: string = '';
  filtroPrecio: number | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data; // Al inicio mostramos todos
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Error al cargar los productos: ", err);
      }
    });
  }

  // --- LÓGICA DE FILTRADO ---
  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(producto => {
      
      // 1. Filtro por Nombre (protegemos con || '' por si viene null)
      const nombreProducto = (producto.nombre || '').toLowerCase();
      const filtroNombreMin = this.filtroNombre.toLowerCase();
      const coincideNombre = nombreProducto.includes(filtroNombreMin);

      // 2. Filtro por Tipo (si está vacío, acepta todos)
      const coincideTipo = this.filtroTipo === '' || producto.tipoAlimento === this.filtroTipo;

      // 3. Filtro por Precio Máximo (FIX: Usamos ?? 0 para evitar el error de undefined)
      const precioProducto = producto.precio ?? 0;
      const coincidePrecio = this.filtroPrecio === null || precioProducto <= this.filtroPrecio;

      return coincideNombre && coincideTipo && coincidePrecio;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroTipo = '';
    this.filtroPrecio = null;
    this.aplicarFiltros(); // Restablece la lista
  }

  // --- ACCIONES CRUD ---

  crearProducto(): void {
    this.router.navigate(['/producto/create']);
  }

  borrarProducto(id: number): void {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        // Recargamos datos del servidor
        this.cargarProductos();
      },
      error: (error) => {
        console.error("Error al borrar", error);
        alert("No se pudo eliminar el producto.");
      }
    });
  }
}