import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesListComponent } from './categories-list.component';
import { CategoryRegisterComponent } from './category-register.component';

@NgModule({
  declarations: [
    CategoriesListComponent,
    CategoryRegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CategoriesRoutingModule,
  ],
  exports: [
    CategoriesListComponent,
    CategoryRegisterComponent
  ]
})
export class CategoriesModule {}