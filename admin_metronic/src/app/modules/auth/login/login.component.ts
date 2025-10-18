import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaulsgtAuth = {
  //   email: '',
  //   password: '',
  // };
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo'
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
    if (this.authService.isLogued()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

    if (this.authService.user) {
      this.router.navigate(['/']);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ])
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ]
    });
  }
submit() {
  this.hasError = false;

  this.authService.login(this.f.email.value, this.f.password.value).subscribe(
    (resp: any) => {
      // Soportar ambas claves: role / rol
      const roleFromApi = resp?.user?.role ?? resp?.user?.rol;
      console.log('RESP:', resp);
      console.log('ROL DEL USUARIO:', roleFromApi);

      if (resp && resp.token && (roleFromApi?.toLowerCase() === 'admin')) {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        console.log('Redirigiendo al dashboard real...');
        this.router.navigate(['/dashboard']);
      } else {
        this.hasError = true;
      }
    },
    (error: any) => {
      console.log('ERROR en login:', error);
      this.hasError = true;
    }
  );
} 

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
