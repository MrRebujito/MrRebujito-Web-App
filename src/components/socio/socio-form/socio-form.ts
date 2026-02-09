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
  id!: number;
  cdr = inject(ChangeDetectorRef);

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Definimos el formulario con todo
    this.formularioSocio = this.formBuilder.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: ['', [Validators.required, Validators.pattern('^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{8}$')]],
      foto: ['', [Validators.pattern('https?://.+')]],
      direccion: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    //Obtenemos el ID de la ruta
    this.id = this.activatedRoute.snapshot.params['id'];
    console.log(this.id);

    if (this.id != null) {
      //Si hay ID, estamos editando. 
      // ELIMINAMOS el control password del formulario.
      this.formularioSocio.removeControl('password');

      this.socioService.getSocio(this.id).subscribe(
        data => { 
          this.formularioSocio.patchValue(data);
          this.cdr.detectChanges();
        },
        error => { console.log(error); }
      );
    }
  }

  onSubmit() {
    this.socio = this.formularioSocio.value;

    if (this.formularioSocio.valid) {
      if (this.id == null) {
        // MODO REGISTRO
        this.socioService.saveSocio(this.socio).subscribe({
          next: (data) => {
            alert("Socio registrado correctamente");
            this.router.navigate(['/socios']);
          },
          error: (error) => { console.log(error); }
        });
      } else {
        // MODO ACTUALIZACIÓN
        // Añadimos el ID al objeto socio antes de enviar
        this.socio.id = this.id;

        this.socioService.updateSocio(this.socio).subscribe(
          data => {
            alert("Socio actualizado correctamente");
            this.router.navigate(['/socios']);
          },
          error => { console.log(error); }
        );
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