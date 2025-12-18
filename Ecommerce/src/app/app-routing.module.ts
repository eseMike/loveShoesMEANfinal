import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule)
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./modules/product/product.module').then((m) => m.ProductModule)
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./modules/cart/cart.module').then((m) => m.CartModule)
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./modules/category/category.module').then(
            (m) => m.CategoryModule
          )
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth-profile/auth-profile.module').then(
        (m) => m.AuthProfileModule
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
