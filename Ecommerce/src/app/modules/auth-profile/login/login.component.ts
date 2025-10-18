import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    public AuthService: AuthService,
    public router: Router
  ) {}
  ngOnInit(): void {
    if (this.AuthService.user) {
      this.router.navigate(['/']);
    }
  }

  login() {
    // Validar que el email y la contraseña no estén vacíos
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.AuthService.login(this.email, this.password).subscribe(
      (response: any) => {
        // Manejar la respuesta aquí
        console.log('Login exitoso:', response);
        if (!response.error && response) {
          // Redirigir al usuario a la página de inicio o a otra página
          this.router.navigate(['/']);
        }
      },
      (error: any) => {
        // Manejar el error aquí
        console.error('Error en el login:', error);
      }
    );
  }
}
