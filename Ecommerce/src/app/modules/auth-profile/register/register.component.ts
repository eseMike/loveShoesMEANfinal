import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  name: string = '';
  surname: string = '';
  password: string = '';
  reset_password: string = '';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    console.log('Entrando a RegisterComponent constructor');
  }
  ngOnInit(): void {
    console.log('Entrando a RegisterComponent ngOnInit');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && Object.keys(user).length > 0) {
      this.router.navigate(['/']);
    }
  }

  registro() {
    if (
      !this.email ||
      !this.name ||
      !this.surname ||
      !this.password ||
      !this.reset_password
    ) {
      alert('Todos los campos son obligatorios');
    }
    if (this.password !== this.reset_password) {
      alert('Las contraseñas no coinciden');
    }
    let data = {
      email: this.email,
      name: this.name,
      surnamer: this.surname,
      password: this.password,
      reset_password: this.reset_password,
      rol: 'cliente'
    };
    this.authService.registro(data).subscribe(
      (response) => {
        console.log(response);
        alert('Registro exitoso');
      },
      (error) => {
        console.error(error);
        alert('Error en el registro');
      }
    );
  }
}
