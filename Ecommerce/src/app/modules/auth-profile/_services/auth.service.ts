import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any = null;
  token: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.localStorageUser;
  }

  get localStorageUser() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    } else {
      this.token = null;
      this.user = null;
    }
    return this.user; // Return the user or token as needed
  }

  login(email: string, password: string) {
    let URL = URL_SERVICIOS + 'users/login';

    return this.http.post(URL, { email, password }).pipe(
      map((response: any) => {
        if (response.token && response.user) {
          // Almacenar el token en el localStorage
          return this.localStorageSave(response);
        } else {
          // Devuelve el status
          console.error('Login failed: Invalid response', response);
          return null;
        }
      }),
      catchError((error: any) => {
        console.error('Login failed', error);
        return throwError(() => error); // importante usar throwError con función
      })
    );
  }

  localStorageSave(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return true;
  }

  registro(data: any) {
    let URL = URL_SERVICIOS + 'users/register';
    return this.http.post(URL, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['auth/login']);
  }
}
function login(email: any, string: any, password: any, string1: any) {
  throw new Error('Function not implemented.');
}
