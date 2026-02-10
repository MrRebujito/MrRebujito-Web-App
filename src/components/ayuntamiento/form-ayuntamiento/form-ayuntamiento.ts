import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ayuntamiento } from '../../../model/ayuntamiento';
import { AyuntamientoService } from '../../../service/ayuntamiento-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-ayuntamiento',
  standalone: true, // Aseguramos que sea standalone para que funcione con tus rutas
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form-ayuntamiento.html',
  styleUrl: './form-ayuntamiento.css',
})
export class FormAyuntamiento implements OnInit {
  formularioAyuntamiento!: FormGroup;
  ayuntamiento!: Ayuntamiento;
  id!: number;
  urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  telefonoPattern = /^[6-9][0-9]{8}$/;
  esPropioPerfil: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private ayuntamientoService: AyuntamientoService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router
  ) {
    this.initForm();
  }

  esAdmin(): boolean {
    return sessionStorage.getItem('rol') === 'ADMIN';
  }

  esAyuntamiento(): boolean {
    return sessionStorage.getItem('rol') === 'AYUNTAMIENTO';
  }

  ngOnInit(): void {
    const paramId = this.activatedRoute.snapshot.params['id'];

    // si lo pilla esque estamos editando
    if (paramId) {
      this.id = parseInt(paramId);
      this.cargarAyuntamiento();
    }

    else if (this.esAyuntamiento() ){
      this.esPropioPerfil = true;
      const ayuntamientoId = sessionStorage.getItem('ayuntamientoId');
      if (ayuntamientoId) {
        this.id = parseInt(ayuntamientoId)
        this.cargarAyuntamiento();
      }
    }

    else if (!this.esAdmin()) {
      console.error("403 Forbidden - Acceso no autorizado");
      return;
    }

    this.initForm();
  }

  private initForm() {
    this.formularioAyuntamiento = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', Validators.required],
      password: ['', this.id ? [] : [Validators.required, Validators.minLength(6)]],
      licenciaMax: [1, [Validators.required, Validators.min(1)]], 
      correo: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      telefono: ['', [Validators.pattern(this.telefonoPattern)]], 
      direccion: [''],
      foto: ['', [Validators.pattern(this.urlPattern)]] 
    });
  }

  private cargarAyuntamiento() {
    this.ayuntamientoService.getAyuntamientoById(this.id).subscribe({
      next: (data) => {
        this.ayuntamiento = data;
        this.formularioAyuntamiento.patchValue({
          nombre: data.nombre,
          username: data.username,
          licenciaMax: data.licenciaMax,
          correo: data.correo,
          telefono: data.telefono,
          direccion: data.direccion,
          foto: data.foto
        });

        // verificamo si es su propio perfil comparando los ids
        const ayuntamientoIdSesion = sessionStorage.getItem('ayuntamientoId');
        if (ayuntamientoIdSesion && parseInt(ayuntamientoIdSesion) === this.id) {
          this.esPropioPerfil = true;
        }
      },
      error: (error) => {
        console.error("Error al cargar ayuntamiento:", error);
        alert("Error al cargar los datos del ayuntamiento");
      }
    });
  }

  onSubmit() {
    if (this.formularioAyuntamiento.valid) {
      this.ayuntamiento = this.formularioAyuntamiento.value;
      
      // rol necesario para el backend
      this.ayuntamiento.rol = 'AYUNTAMIENTO';

      // Creación siendo admin
      if (this.id == null) {
        this.ayuntamientoService.saveAyuntamiento(this.ayuntamiento).subscribe({
          next: () => {
            alert("¡Ayuntamiento registrado correctamente!");
            this.router.navigate(['/ayuntamientos']);
          },
          error: (error) => {
            console.error("Error al crear el ayuntamiento: ", error);
            alert("Error al guardar. Revisa la consola.");
          }
        });
      } 
      // ACTUALIZACIÓN
      else {
        // Si es propio perfil (AYUNTAMIENTO), usar endpoint sin ID
        if (this.esPropioPerfil && this.esAyuntamiento()) {
          this.ayuntamientoService.updatePropioPerfil(this.ayuntamiento).subscribe({
            next: () => {
              alert("¡Perfil actualizado correctamente!");
              this.router.navigate(['/ayuntamientos']);
            },
            error: (error) => {
              console.error("Error al actualizar perfil: ", error);
              alert("Error al actualizar. Revisa la consola.");
            }
          });
        } 
        // Si es ADMIN, usar endpoint con ID
        else {
          this.ayuntamientoService.updateAyuntamiento(this.id, this.ayuntamiento).subscribe({
            next: () => {
              alert("¡Ayuntamiento actualizado correctamente!");
              this.router.navigate(['/ayuntamientos']);
            },
            error: (error) => {
              console.error("Error al actualizar el ayuntamiento: ", error);
              alert("Error al actualizar. Revisa la consola.");
            }
          });
        }
      }
    } else {
      this.formularioAyuntamiento.markAllAsTouched();
      alert("Por favor, completa todos los campos obligatorios correctamente");
    }
  }

  borrarPerfil() {
    if (!confirm("¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer.")) {
      return;
    }

    // Si es propio perfil (AYUNTAMIENTO), usar endpoint sin ID
    if (this.esPropioPerfil && this.esAyuntamiento()) {
      this.ayuntamientoService.deletePropioPerfil().subscribe({
        next: () => {
          alert("Perfil eliminado correctamente");
          // Limpiar sesión
          sessionStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error("Error al eliminar perfil:", error);
          alert("Error al eliminar el perfil");
        }
      });
    }
  }
}




