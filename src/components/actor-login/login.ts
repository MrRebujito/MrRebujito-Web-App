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
  loginError!: String

  constructor(
    private actorService: ActorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      this.actorLogin = this.formLogin.value;
      this.actorService.login(this.actorLogin).subscribe(
        data => {
          sessionStorage.setItem("token", data);
          this.cargarUsuarioLogueado()
          this.router.navigate(['/noticia']).then(() => {
            window.location.reload();
          });
        },
        error => {
          this.loginError = 'Usuario o contraseña incorrectos'
          console.log(error)
          this.cdr.detectChanges();
        }
      )
    }
  }

  cargarUsuarioLogueado() {
    this.actorService.actorLogin().subscribe(
      data => {
        sessionStorage.setItem("username", data.username)
        sessionStorage.setItem("rol", data.rol.toString())
      }, error => {
        console.log(error)
      })
  }
}