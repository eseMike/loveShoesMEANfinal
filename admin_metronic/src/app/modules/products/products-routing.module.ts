// admin_metronic/src/app/modules/products/products-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './products-list.component';
import { ProductsRegisterComponent } from './products-register.component';

const routes: Routes = [
  { path: 'products/list', component: ProductsListComponent },
  { path: 'products/register', component: ProductsRegisterComponent },
  { path: 'products/register/:id', component: ProductsRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}