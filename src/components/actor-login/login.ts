import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActorService } from '../../service/actor-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActorLogin } from '../../model/actor-login';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formLogin: FormGroup;
  actorLogin!: ActorLogin;
  loginError!: String;

  constructor(
    private actorService: ActorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      this.actorLogin = this.formLogin.value;
      this.actorService.login(this.actorLogin).subscribe(
        (data) => {
          sessionStorage.setItem('token', data);
          this.cargarUsuarioLogueado();
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.loginError = 'Usuario o contraseña incorrectos';
          console.log(error);
          this.cdr.detectChanges();
        },
      );
    }
  }

  cargarUsuarioLogueado() {
    this.actorService.login(this.actorLogin).subscribe({
      next: (data) => {
        sessionStorage.setItem('token', data);
        this.cargarUsuarioLogueado();
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        // MANUEL SI VES ESTO, SOY MUYYYYY BUENO IO SOY EL MEJOR PROMPT ENGINEER DEL MUNDO POR CIERTO SON LAS 1:16 DE LA MAÑANA Y AQUI SEGUIMOS
        ///////
        // Ahora esto se ejecutará porque el interceptor no ha navegado a /forbidden
        this.loginError = 'Usuario o contraseña incorrectos';
        this.cdr.detectChanges(); // Fuerza a Angular a mostrar la alerta en el HTML
      },
    });
  }
}
