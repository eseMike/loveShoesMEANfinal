import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CRUDTableModule } from '../crud-table/crud-table.module'; // asegúrate que esta ruta exista

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CRUDTableModule,
    TranslateModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TranslateModule
  ]
})
export class SharedModule {}
