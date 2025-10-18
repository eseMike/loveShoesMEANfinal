import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoriesService, Category } from './categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  template: `
    <div class="categories-list">
      <h1>Listado de categorías</h1>

      <div style="margin: 8px 0;">
        <input
          placeholder="Buscar por nombre o descripción"
          [(ngModel)]="q"
          (keyup.enter)="load()"
        />
      <button (click)="load()" [disabled]="loading">Buscar</button>
        <button style="margin-left:8px" routerLink="/categories/register">+ Nueva</button>
      </div>

      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th style="width:140px;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of items">
            <td>{{ c.name }}</td>
            <td>{{ c.description }}</td>
            <td>{{ c.state ? 'Activo' : 'Inactivo' }}</td>
           <td>
  <button (click)="toggle(c)" [disabled]="loading">
    {{ c.state ? 'Desactivar' : 'Activar' }}
  </button>

  <button style="margin-left:8px" (click)="edit(c)" [disabled]="loading">Editar</button>

  <button style="margin-left:8px" (click)="remove(c)" [disabled]="loading">Eliminar</button>
</td>
          </tr>
        </tbody>
      </table>

            <p *ngIf="!items.length" style="margin-top:12px;">Sin resultados</p>
            <p *ngIf="loading" style="margin-top:12px; color: gray;">Cargando...</p>
    </div>
  `,
  styles: [`.categories-list { padding: 1.5rem; }`],
})
export class CategoriesListComponent implements OnInit {
  items: Category[] = [];
  q = '';
  loading = false;

  constructor(private categories: CategoriesService, private cdr: ChangeDetectorRef, private router: Router ) {}
ngOnInit() {
  this.load();
}

load() {
  this.loading = true;
  this.categories.list(this.q).subscribe({
next: (res: any) => {
  const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
  this.items = data;
  this.cdr.detectChanges(); // 👈 forzamos actualización de la vista
  this.loading = false;
},
    error: (err) => {
      console.error('Error al listar categorías', err);
      this.loading = false;
    },
  });
}

  toggle(c: Category) {
    const call = c.state ? this.categories.deactivate(c._id!) : this.categories.activate(c._id!);
    call.subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Error al cambiar estado', err);
        alert('No se pudo cambiar el estado.');
      },
    });
  }

  edit(c: Category) {
  if (!c._id) return;
  this.router.navigate(['/categories/register', c._id]);
  }
  
  remove(c: Category) {
  if (!c?._id) return;

  const ok = confirm(`¿Eliminar la categoría "${c.name}"? Esta acción no se puede deshacer.`);
  if (!ok) return;

  this.loading = true;
 this.categories.remove(c._id).subscribe({
  next: () => {
    this.load();                 // 👈 recarga la lista desde el backend
    alert('Categoría eliminada correctamente');
  },
  error: (err) => {
    console.error('Error al eliminar categoría', err);
    this.loading = false;
    alert('No se pudo eliminar la categoría');
  },
});
}
} 