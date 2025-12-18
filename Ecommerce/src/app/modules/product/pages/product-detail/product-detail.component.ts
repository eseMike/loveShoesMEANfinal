import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../../../shared/product.service';
import { CartService, CartItem } from '../../../../shared/cart.service';
import { CurrencyService } from '../../../../shared/currency.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  product: Product | null = null;

  // Helpers de UI
  selectedImageIndex = 0;
  private readonly placeholder = 'assets/images/product/placeholder.png';

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.error = 'ID de producto inválido.';
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = null;

      this.productService.detail(id).subscribe({
        next: (p: Product) => {
          this.product = p;
          this.selectedImageIndex = 0; // reset al cargar un nuevo producto
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar producto:', err);
          this.error = err?.error?.message || 'No se pudo cargar el producto.';
          this.loading = false;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ======== Getters seguros para el template ========

  get hasProduct(): boolean {
    return !!this.product;
  }

  /** Normaliza arreglo de imágenes a string[] */
  get images(): string[] {
    const imgs = (this.product as any)?.images;
    if (Array.isArray(imgs)) {
      return imgs
        .map((im: any) => typeof im === 'string' ? im : (im?.url || im?.src || ''))
        .filter(Boolean);
    }
    return [];
  }

  get mainImage(): string {
    return this.images[this.selectedImageIndex] || this.placeholder;
  }

  setImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.selectedImageIndex = index;
    }
  }

  get title(): string {
    return (this.product as any)?.name || (this.product as any)?.title || 'Producto';
    }

  get description(): string {
    return (this.product as any)?.description || '';
  }

  private normalizePrice(v: any): number {
    if (typeof v === 'number') { return v; }
    if (typeof v === 'string') {
      const n = Number(v);
      return isFinite(n) ? n : 0;
    }
    if (v && (typeof v === 'object')) {
      const n = Number(v.amount ?? v.value);
      return isFinite(n) ? n : 0;
    }
    return 0;
  }

  get price(): number {
    return this.normalizePrice((this.product as any)?.price);
  }

  get oldPrice(): number | null {
    const op = this.normalizePrice((this.product as any)?.oldPrice);
    return op > 0 ? op : null;
  }

  /** Indica si hay stock disponible */
  get inStock(): boolean {
    const p: any = this.product as any;
    const s = p?.stock ?? p?.quantity ?? 0;
    const n = typeof s === 'string' ? Number(s) : s;
    return Number.isFinite(n) ? n > 0 : false;
  }

  /** Agrega el producto actual al carrito usando CartService */
  addToCart(): void {
    if (!this.product) { return; }

    const item: CartItem = {
      _id: (this.product as any)?._id ?? (this.product as any)?.id,
      title: (this.product as any)?.title ?? (this.product as any)?.name ?? 'Producto',
      price: Number((this.product as any)?.price) || 0,
      quantity: 1,
      image: this.images[0]
    };

    this.cartService.addItem(item);
  }

  trackByIndex(index: number, _item: unknown): number {
    return index;
  }
}
