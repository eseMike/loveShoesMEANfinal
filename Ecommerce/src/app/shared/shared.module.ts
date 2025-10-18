import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CRUDTableModule } from '../crud-table/crud-table.module'; // asegúrate que esta ruta exista

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CRUDTableModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule {}
