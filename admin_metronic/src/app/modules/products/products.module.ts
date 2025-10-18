import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductsListComponent } from './products-list.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsRegisterComponent } from './products-register.component';

@NgModule({
  declarations: [ProductsListComponent, ProductsRegisterComponent],
  imports: [
    CommonModule,  
    FormsModule,
    ProductsRoutingModule
  ],
  exports: [ProductsListComponent, ProductsRegisterComponent]
})
export class ProductsModule {}   