import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '../categories/categories.service';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products-register',
  template: `
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">{{ isEdit ? 'Editar producto' : 'Registrar producto' }}</h3>
      </div>

      <form (ngSubmit)="submit(name.value, description.value, price.value, stock.value, categoryId.value)">
        <div class="card-body">

          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input #name type="text" class="form-control" placeholder="Nombre del producto" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea #description class="form-control" rows="3" placeholder="Descripción"></textarea>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Precio</label>
              <input #price type="number" step="0.01" min="0" class="form-control" placeholder="0.00" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stock</label>
              <input #stock type="number" min="0" class="form-control" placeholder="0" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Categoría</label>
              <select #categoryId class="form-select" required>
                <option value="" disabled [selected]="!categories?.length">Seleccione una categoría</option>
                <option *ngFor="let c of categories" [value]="c._id">{{ c.name }}</option>
              </select>

            </div>
          </div>

        </div>

        <div class="card-footer d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ isEdit ? 'Actualizar' : 'Registrar' }}
          </button>
          <button type="button" class="btn btn-light" (click)="cancel()" [disabled]="loading">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProductsRegisterComponent implements OnInit{

  
  loading = false;
  isEdit = false; 
  categories: Category[] = [];  

  constructor(private router: Router, private categoriesSrv: CategoriesService, private productsSrv: ProductsService, private cdr: ChangeDetectorRef ) {}

ngOnInit(): void {
  this.categoriesSrv.list('').subscribe({
    next: (res: any) => {
      console.log('[ProductsRegister] categorías -> respuesta cruda:', res);
      this.categories = Array.isArray(res)
        ? res
        : (Array.isArray(res?.data) ? res.data : []);
      console.log('[ProductsRegister] categorías asignadas length =', this.categories.length);

      // 👇 Forzar la actualización de la vista
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error cargando categorías', err);
      alert('No se pudieron cargar las categorías');
    },
  });
}
  
  submit(name: string, description: string, price: string, stock: string, categoryId: string) {
  if (!name?.trim() || !categoryId) {
    alert('Completa el nombre y la categoría.');
    return;
  }

  const payload = {
    name: name.trim(),
    description: description?.trim() || '',
    price: Number(price),
    stock: Number(stock),
    category: categoryId
  };

  this.loading = true;
  this.productsSrv.register(payload).subscribe({
    next: () => {
      this.loading = false;
      alert('Producto registrado');
      this.router.navigate(['/products/list']);
    },
    error: (err) => {
      console.error('Error registrando producto', err);
      this.loading = false;
      alert('No se pudo registrar el producto');
    }
  });
}

  cancel() {
    this.router.navigate(['/products/list']);
  }

}