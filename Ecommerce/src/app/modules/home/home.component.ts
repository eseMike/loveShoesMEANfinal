import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductListResponse } from '../../shared/product.service';
import { CartService, CartItem } from '../../shared/cart.service';
import { CurrencyService } from '../../shared/currency.service';

declare var $: any;
declare function HOMEINIT([]): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error?: string;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loading = true;
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

  trackById(_index: number, item: Product) {
    return item._id ?? _index;
  }

  handleAddToCart(p: Product): void {
    if (!p) return;

    try {
      const STORAGE_KEY = 'cart';
      const raw = localStorage.getItem(STORAGE_KEY);
      const items: CartItem[] = raw ? JSON.parse(raw) : [];

      const item: CartItem = {
        _id: (p as any)?._id ?? (p as any)?.id,
        name: (p as any)?.name ?? (p as any)?.title ?? 'Producto',
        price: Number((p as any)?.price) || 0,
        qty: 1,
      };

      const idx = items.findIndex(it => String(it._id) === String(item._id));
      if (idx >= 0) {
        const current = Number(items[idx].qty) || 1;
        items[idx].qty = current + 1;
      } else {
        items.push(item);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      this.cartService.syncFromStorage();
    } catch (e) {
      console.error('[home.handleAddToCart] error:', e);
      alert('No se pudo agregar al carrito');
    }
  }
}
