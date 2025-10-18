import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthProfileComponent } from './auth-profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthProfileComponent,
    children: [
      {
        // canActivate: [AuthGuard],
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthProfileRoutingModule {}
