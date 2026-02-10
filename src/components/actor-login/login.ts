import { ChangeDetectorRef, Component } from '@angular/core';
import { ActorService } from '../../service/actor-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActorLogin } from '../../model/actor-login';

@Component({
  selector: 'app-login',
  standalone: true,
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
    private cdr: ChangeDetectorRef
  ) {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      this.loginError = '';
      this.actorLogin = this.formLogin.value;
      
      this.actorService.login(this.actorLogin).subscribe({
        next: (token) => {
          // El token llega como texto plano
          sessionStorage.setItem("token", token);
          
          this.actorService.actorLogin().subscribe({
            next: (actor) => {
              sessionStorage.setItem("username", actor.username);
              sessionStorage.setItem("rol", actor.rol.toString());
              
              this.router.navigate(['/solicitudes']).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              console.error(error);
              this.loginError = 'Error cargando perfil. Reinicia el backend si acabas de añadir el endpoint.';
              this.cdr.detectChanges();
            }
          });
        },
        error: (error) => {
          console.error(error);
          this.loginError = 'Usuario o contraseña incorrectos';
          this.cdr.detectChanges();
        }
      });
    }
  }
}