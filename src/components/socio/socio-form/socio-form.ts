import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SocioService } from '../../../service/socio-service';
import { Socio } from '../../../model/socio';

@Component({
  selector: 'app-socio-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './socio-form.html',
  styleUrl: './socio-form.css',
})
export class SocioForm implements OnInit {
  formularioSocio: FormGroup;
  socio!: Socio;
  id: number | null = null;
  cdr = inject(ChangeDetectorRef);

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formularioSocio = this.formBuilder.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      // Corregido: El patrón ahora permite empezar por 6-9 seguido de 8 números
      telefono: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{8}$')]],
      foto: ['', [Validators.pattern('https?://.+')]], // Validación simple de URL
      direccion: [''],
      username: ['', Validators.required],
      password: ['', this.id == null ? [Validators.required, Validators.minLength(6)] : []]
    });
  }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.params['id'];

    if (idParam && !isNaN(Number(idParam))) {
      this.id = Number(idParam);

      this.socioService.getSocio(this.id).subscribe({
        next: (data: Socio) => {
          this.socio = data;
          this.formularioSocio.patchValue(this.socio);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error("Error al recuperar el socio:", error);
        }
      });
    } else {
      this.id = null;
      console.log("Modo registro: No se busca ningún socio.");
    }
  }

 onSubmit(): void {
    if (this.formularioSocio.valid) {
      const datosSocio = this.formularioSocio.value;

      if (this.id == null) {
        // CREACIÓN DE SOCIO
        this.socioService.saveSocio(datosSocio).subscribe({
          next: () => {
            alert("Socio registrado correctamente");
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error("Error al crear socio:", error);
            alert("Error al registrar: Compruebe los datos o el nombre de usuario.");
          }
        });
      } else {
        // EDICIÓN DE SOCIO
        datosSocio.id = this.id;
        this.socioService.updateSocio(this.id, datosSocio).subscribe({
          next: () => {
            alert("Datos actualizados correctamente");
            this.router.navigate(['/']); // <--- Redirigir al Inicio
          },
          error: (error) => {
            console.error("Error al actualizar socio:", error);
          }
        });
      }
    }
  }

  esInvalido(nombreCampo: string): boolean {
    const control = this.formularioSocio.get(nombreCampo);
    if (control != null) {
      return control.invalid && control.touched;
    }
    return false;
  }
}