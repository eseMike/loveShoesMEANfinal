import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list.component';
import { CategoryRegisterComponent } from './category-register.component';

const routes: Routes = [
  { path: '', component: CategoriesListComponent },
  { path: 'register', component: CategoryRegisterComponent },
  { path: 'register/:id', component: CategoryRegisterComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}