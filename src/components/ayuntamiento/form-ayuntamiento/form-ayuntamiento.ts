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
  urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/

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

  ngOnInit(): void {
    if (!this.esAdmin()) {
        console.error("403 Forbidden - Acceso no autorizado");
        return; 
    }

    this.id = this.activatedRoute.snapshot.params['id'];
    this.initForm();
  }

  private initForm() {
    this.formularioAyuntamiento = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', Validators.required],
      password: ['', this.id ? [] : [Validators.required]],
      licenciaMax: [0, [Validators.required, Validators.min(1)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      foto: ['', [Validators.pattern(this.urlPattern)]]
    });
  }

  onSubmit() {
    if (this.formularioAyuntamiento.valid) {
      this.ayuntamiento = this.formularioAyuntamiento.value;
      
      //rol necesario para el backend
      this.ayuntamiento.rol = 'AYUNTAMIENTO';

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
      } else {
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
    } else {
      this.formularioAyuntamiento.markAllAsTouched();
    }
  }
}