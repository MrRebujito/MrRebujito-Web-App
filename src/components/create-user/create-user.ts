import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Servicios
import { AdminService } from '../../service/administrador-service';
import { AyuntamientoService } from '../../service/ayuntamiento-service';
import { CasetaService } from '../../service/caseta-service';
import { SocioService } from '../../service/socio-service';

// Modelos
import { Administrador } from '../../model/administrador';
import { Ayuntamiento } from '../../model/ayuntamiento';
import { Caseta } from '../../model/caseta';
import { Socio } from '../../model/socio';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css']
})
export class CreateUser implements OnInit {
  userForm: FormGroup;
  tipoSeleccionado: string | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  // Validators
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  telefonoPattern = /^[6-9][0-9]{8}$/;
  urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;

  cdr = inject(ChangeDetectorRef);

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private ayuntamientoService: AyuntamientoService,
    private casetaService: CasetaService,
    private socioService: SocioService,
    private router: Router
  ) {
    this.userForm = this.createBaseForm();
  }

  ngOnInit(): void {
    // Inicializamos sin tipo seleccionado
  }

  /**
   * Crea el formulario base con campos comunes
   */
  private createBaseForm(): FormGroup {
    return this.formBuilder.group({
      // Campo selector de tipo
      tipo: [null, Validators.required],
      
      // Campos comunes de Actor
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      foto: ['', [Validators.pattern(this.urlPattern)]],
      telefono: ['', [Validators.pattern(this.telefonoPattern)]],
      direccion: [''],
      
      // Campos de ADMIN y SOCIO
      primerApellido: [''],
      segundoApellido: [''],
      
      // Campos de AYUNTAMIENTO
      licenciaMax: [1, [Validators.min(1)]],
      
      // Campos de CASETA
      razonS: [''],
      aforo: [1, [Validators.min(1)]],
      publica: [true],
      
      // Campos de SOCIO
      fechaAlta: ['']
    });
  }

  /**
   * Se ejecuta al cambiar el tipo de usuario
   */
  onTipoChange(): void {
    this.tipoSeleccionado = this.userForm.get('tipo')?.value;
    this.updateValidators();
  }

  /**
   * Actualiza los validadores según el tipo seleccionado
   */
  private updateValidators(): void {
    // Resetear todos los validadores específicos
    this.resetSpecificValidators();

    if (!this.tipoSeleccionado) return;

    switch (this.tipoSeleccionado) {
      case 'ADMIN':
        this.userForm.get('primerApellido')?.setValidators([Validators.required]);
        break;
        
      case 'AYUNTAMIENTO':
        this.userForm.get('licenciaMax')?.setValidators([Validators.required, Validators.min(1)]);
        break;
        
      case 'CASETA':
        this.userForm.get('razonS')?.setValidators([Validators.required]);
        this.userForm.get('aforo')?.setValidators([Validators.required, Validators.min(1)]);
        // publica tiene valor por defecto true, no es obligatorio marcarlo
        break;
        
      case 'SOCIO':
        this.userForm.get('primerApellido')?.setValidators([Validators.required]);
        // fechaAlta es opcional
        break;
    }

    // Actualizar validez
    this.userForm.get('primerApellido')?.updateValueAndValidity();
    this.userForm.get('licenciaMax')?.updateValueAndValidity();
    this.userForm.get('razonS')?.updateValueAndValidity();
    this.userForm.get('aforo')?.updateValueAndValidity();
  }

  /**
   * Resetea los validadores de campos específicos
   */
  private resetSpecificValidators(): void {
    this.userForm.get('primerApellido')?.clearValidators();
    this.userForm.get('primerApellido')?.setValue('');
    
    this.userForm.get('licenciaMax')?.clearValidators();
    this.userForm.get('licenciaMax')?.setValue(1);
    
    this.userForm.get('razonS')?.clearValidators();
    this.userForm.get('razonS')?.setValue('');
    
    this.userForm.get('aforo')?.clearValidators();
    this.userForm.get('aforo')?.setValue(1);
    
    // Resetear valores
    this.userForm.get('segundoApellido')?.setValue('');
    this.userForm.get('publica')?.setValue(true);
    this.userForm.get('fechaAlta')?.setValue('');
  }

  /**
   * Verifica si ADMIN y SOCIO deben mostrar apellidos
   */
  mostrarApellidos(): boolean {
    return this.tipoSeleccionado === 'ADMIN' || this.tipoSeleccionado === 'SOCIO';
  }

  /**
   * Verifica si un campo es inválido
   */
  isInvalid(campo: string): boolean {
    const control = this.userForm.get(campo);
    return control ? (control.invalid && (control.touched || this.submitted)) : false;
  }

  /**
   * Envío del formulario
   */
  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    const tipo = this.userForm.get('tipo')?.value;
    const formData = this.userForm.value;

    switch (tipo) {
      case 'ADMIN':
        this.crearAdministrador(formData);
        break;
      case 'AYUNTAMIENTO':
        this.crearAyuntamiento(formData);
        break;
      case 'CASETA':
        this.crearCaseta(formData);
        break;
      case 'SOCIO':
        this.crearSocio(formData);
        break;
    }
  }

  /**
   * Crear Administrador
   */
  private crearAdministrador(data: any): void {
    const admin: Administrador = {
      id: 0,
      nombre: data.nombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido || '',
      correo: data.correo,
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      foto: data.foto || '',
      username: data.username,
      password: data.password,
      rol: 'ADMIN',
      baneado: false
    };

    this.adminService.saveAdministrador(admin).subscribe({
      next: () => {
        this.showSuccess('Administrador creado correctamente');
        setTimeout(() => this.router.navigate(['/administradores']), 2000);
      },
      error: (error) => {
        console.error('Error al crear administrador:', error);
        this.showError('Error al crear el administrador. Comprueba que el nombre de usuario no exista.');
      }
    });
  }

  /**
   * Crear Ayuntamiento
   */
  private crearAyuntamiento(data: any): void {
    const ayuntamiento: Ayuntamiento = {
      id: 0,
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      foto: data.foto || '',
      username: data.username,
      password: data.password,
      rol: 'AYUNTAMIENTO',
      baneado: false,
      licenciaMax: data.licenciaMax
    };

    this.ayuntamientoService.saveAyuntamiento(ayuntamiento).subscribe({
      next: () => {
        this.showSuccess('Ayuntamiento creado correctamente');
        setTimeout(() => this.router.navigate(['/ayuntamientos']), 2000);
      },
      error: (error) => {
        console.error('Error al crear ayuntamiento:', error);
        this.showError('Error al crear el ayuntamiento. Comprueba que el nombre de usuario no exista.');
      }
    });
  }

  /**
   * Crear Caseta
   */
  private crearCaseta(data: any): void {
    const caseta: Caseta = {
      id: 0,
      nombre: data.nombre,
      razonS: data.razonS,
      aforo: data.aforo,
      publica: data.publica,
      correo: data.correo,
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      foto: data.foto || '',
      username: data.username,
      password: data.password,
      rol: 'CASETA',
      baneado: false,
      socios: [],
      solicitudesLicencia: [],
      productos: []
    };

    this.casetaService.saveCaseta(caseta).subscribe({
      next: () => {
        this.showSuccess('Caseta creada correctamente');
        setTimeout(() => this.router.navigate(['/casetas']), 2000);
      },
      error: (error) => {
        console.error('Error al crear caseta:', error);
        this.showError('Error al crear la caseta. Comprueba que el nombre de usuario no exista.');
      }
    });
  }

  /**
   * Crear Socio
   */
  private crearSocio(data: any): void {
    const socio: Socio = {
      id: 0,
      nombre: data.nombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido || '',
      correo: data.correo,
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      foto: data.foto || '',
      username: data.username,
      password: data.password,
      rol: 'SOCIO',
      baneado: false,
      fechaAlta: data.fechaAlta ? new Date(data.fechaAlta) : new Date()
    };

    this.socioService.saveSocio(socio).subscribe({
      next: () => {
        this.showSuccess('Socio creado correctamente');
        setTimeout(() => this.router.navigate(['/socios']), 2000);
      },
      error: (error) => {
        console.error('Error al crear socio:', error);
        this.showError('Error al crear el socio. Comprueba que el nombre de usuario no exista.');
      }
    });
  }

  /**
   * Mostrar mensaje de éxito
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
    this.cdr.detectChanges();
  }

  /**
   * Mostrar mensaje de error
   */
  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
    this.cdr.detectChanges();
  }
}