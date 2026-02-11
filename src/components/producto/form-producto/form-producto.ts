import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../service/producto-service';
import { Producto } from '../../../model/producto';

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form-producto.html',
  styleUrls: ['./form-producto.css']
})
export class FormProducto implements OnInit {
  
  formularioProducto!: FormGroup;
  id: number | null = null; // null = Crear, número = Editar
  
  // Opciones para el select
  tiposAlimento: string[] = ['COMIDA', 'BEBIDA'];

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Verificar si viene una ID en la URL (Modo Edición)
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.cargarDatos(this.id);
    }
  }

  // Inicializamos el formulario con las validaciones pedidas
  initForm(): void {
    this.formularioProducto = this.formBuilder.group({
      // 1. Nombre Requerido
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      
      // 2. Precio > 0 (mínimo 0.01)
      precio: [null, [Validators.required, Validators.min(0.01)]],
      
      // 3. Stock >= 0 (mínimo 0)
      stock: [0, [Validators.required, Validators.min(0)]],
      
      // Tipo requerido
      tipoAlimento: ['COMIDA', [Validators.required]]
    });
  }

  // Carga los datos del backend al formulario
  cargarDatos(id: number): void {
    this.productoService.getProductoById(id).subscribe({
      next: (producto: Producto) => {
        this.formularioProducto.patchValue({
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock, // Cargamos el stock
          tipoAlimento: producto.tipoAlimento
        });
      },
      error: (err: any) => {
        console.error('Error al cargar producto:', err);
        alert('No se pudo cargar el producto para editar.');
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit(): void {
    // Si el formulario no es válido, marcamos todo en rojo y paramos
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched(); 
      return;
    }

    // Preparar objeto
    const producto: Producto = this.formularioProducto.value;

    // Lógica de Guardado
    if (this.id) {
      // --- MODO EDICIÓN (PUT) ---
      this.productoService.updateProducto(this.id, producto).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err: any) => {
          console.error('Error actualizando:', err);
          alert('Hubo un error al actualizar el producto.');
        }
      });
    } else {
      // --- MODO CREACIÓN (POST) ---
      this.productoService.createProducto(producto).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err: any) => {
          console.error('Error creando:', err);
          alert('Hubo un error al crear el producto.');
        }
      });
    }
  }
}