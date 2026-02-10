import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CasetaService } from '../../../service/caseta-service';
import { Caseta } from '../../../model/caseta';

@Component({
  selector: 'app-caseta-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './caseta-form.html',
  styleUrls: [],
})
export class CasetaForm implements OnInit {
  formularioCaseta: FormGroup;
  caseta: Caseta = {} as Caseta;
  id: number | null = null;
  cdr = inject(ChangeDetectorRef);

  constructor(
    private formBuilder: FormBuilder,
    private casetaService: CasetaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formularioCaseta = this.formBuilder.group({
      // Campos heredados de Actor
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[6-9][0-9]{8}$')]],
      foto: ['', [Validators.pattern('https?://.+')]],
      direccion: [''],
      username: ['', Validators.required],
      password: ['', this.id == null ? [Validators.required, Validators.minLength(6)] : []],

      razonS: ['', Validators.required],
      aforo: ['', [Validators.required, Validators.min(1)]],
      publica: [true],
    });
  }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.params['id'];

    if (idParam && !isNaN(Number(idParam))) {
      this.id = Number(idParam);

      this.casetaService.getCaseta(this.id).subscribe({
        next: (data: Caseta) => {
          this.caseta = data;
          this.formularioCaseta.patchValue(this.caseta);
          // En edición, la contraseña no es obligatoria
          this.formularioCaseta.get('password')?.clearValidators();
          this.formularioCaseta.get('password')?.updateValueAndValidity();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error("Error al recuperar la caseta:", error);
        }
      });
    } else {
      this.id = null;
      console.log("Modo registro: Nueva caseta.");
    }
  }

  onSubmit(): void {
    if (this.formularioCaseta.valid) {
      const datosCaseta = this.formularioCaseta.value;

      if (this.id == null) {
        // CREAR nueva caseta
        this.casetaService.saveCaseta(datosCaseta).subscribe({
          next: () => {
            alert("Caseta registrada correctamente");
            this.router.navigate(['/casetas']);
          },
          error: (error) => {
            console.error("Error al crear caseta:", error);
            alert("Error al registrar la caseta. Compruebe los datos o el nombre de usuario.");
          }
        });
      } else {
        // ACTUALIZAR caseta existente
        datosCaseta.id = this.id;
        this.casetaService.updateCaseta(datosCaseta).subscribe({
          next: () => {
            alert("Caseta actualizada correctamente");
            this.router.navigate(['/casetas']);
          },
          error: (error) => {
            console.error("Error al actualizar caseta:", error);
            alert("Error al actualizar. Verifique los datos.");
          }
        });
      }
    }
  }

  esInvalido(nombreCampo: string): boolean {
    const control = this.formularioCaseta.get(nombreCampo);
    if (control != null) {
      return control.invalid && control.touched;
    }
    return false;
  }
}