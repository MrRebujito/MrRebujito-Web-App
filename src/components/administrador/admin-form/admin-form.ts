import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../service/administrador-service';
import { Administrador } from '../../../model/administrador';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-form.html',
  styleUrl: './admin-form.css',
})
export class AdminForm implements OnInit {
  formularioAdmin: FormGroup;
  administrador: Administrador = {} as Administrador;
  id: number | null = null;
  cdr = inject(ChangeDetectorRef);

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formularioAdmin = this.formBuilder.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{8}$')]],
      foto: ['', [Validators.pattern('https?://.+')]],
      direccion: [''],
      username: ['', Validators.required],
      password: ['', this.id == null ? [Validators.required, Validators.minLength(6)] : []]
    });
  }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.params['id'];

    if (idParam && !isNaN(Number(idParam))) {
      this.id = Number(idParam);

      this.adminService.getAdministrador(this.id).subscribe({
        next: (data: Administrador) => {
          this.administrador = data;
          this.formularioAdmin.patchValue(this.administrador);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error("Error al recuperar el administrador:", error);
        }
      });
    } else {
      this.id = null;
      console.log("Modo registro: No se busca ningún administrador.");
    }
  }

  onSubmit(): void {
    if (this.formularioAdmin.valid) {
      const datosAdmin = this.formularioAdmin.value;

      if (this.id == null) {
        this.adminService.saveAdministrador(datosAdmin).subscribe({
          next: () => {
            alert("Administrador registrado correctamente");
            this.router.navigate(['/administradores']);
          },
          error: (error) => {
            console.error("Error al crear administrador:", error);
            alert("Error al registrar: Compruebe los datos o el nombre de usuario.");
          }
        });
      } else {
        datosAdmin.id = this.id;
        this.adminService.updateAdministrador(datosAdmin).subscribe({
          next: () => {
            alert("Datos actualizados correctamente");
            this.router.navigate(['/administradores']);
          },
          error: (error) => {
            console.error("Error al actualizar administrador:", error);
          }
        });
      }
    }
  }

  esInvalido(nombreCampo: string): boolean {
    const control = this.formularioAdmin.get(nombreCampo);
    if (control != null) {
      return control.invalid && control.touched;
    }
    return false;
  }
}
