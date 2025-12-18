import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductListResponse, Category } from '../../shared/product.service';
import { CartService, CartItem } from '../../shared/cart.service';
import { CurrencyService } from '../../shared/currency.service';
import { environment } from 'src/environments/environment';

declare var $: any;
declare function HOMEINIT([]): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  error?: string;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.listCategories().subscribe({
      next: (cats) => {
        this.categories = cats ?? [];
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      }
    });
    this.productService
      .list({ page: 1, limit: 12 })
      .subscribe({
        next: (res: ProductListResponse | Product[]) => {
          const items = Array.isArray(res) ? res : (res.items || res.data || []);
          this.products = (items as Product[]) ?? [];
          this.loading = false;
          // Inicializar scripts del theme cuando los datos ya están en el DOM
          setTimeout(() => HOMEINIT($), 0);
        },
        error: (err) => {
          console.error('Error cargando productos', err);
          this.error = 'No se pudieron cargar los productos.';
          this.loading = false;
          setTimeout(() => HOMEINIT($), 0);
        },
      });
  }

  trackById(_index: number, item: { _id?: string }) {
    return item?._id ?? _index;
  }

  handleAddToCart(p: Product): void {
    if (!p) return;

    const item: CartItem = {
      _id: (p as any)?._id ?? (p as any)?.id,
      title: (p as any)?.title ?? (p as any)?.name ?? 'Producto',
      price: Number((p as any)?.price) || 0,
      quantity: 1,
      image: (p as any)?.images?.[0]
    };

    this.cartService.addItem(item);
  }
}
