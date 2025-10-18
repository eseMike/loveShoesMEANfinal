import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductsService, Product } from './products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: 'products-list.component.html',
})
export class ProductsListComponent implements OnInit {
  items: Product[] = [];
  loading = false;
  q = ''; // para búsqueda

  constructor(
    private productsSrv: ProductsService,
    private cdr: ChangeDetectorRef,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.productsSrv.list(this.q).subscribe({
      next: (res: any) => {
        this.items = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loading = false;
      }
    });
  }

    new() {
    this.router.navigate(['/products/register']);
  }
}