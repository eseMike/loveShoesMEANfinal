import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../cart.service';
import { CurrencyService } from '../currency.service';
import { LanguageService } from '../language.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Observable para el contador del carrito
  cartCount$!: Observable<number>;
  // Streams para el dropdown del carrito
  items$ = this.cartService.items$;
  subtotal$ = this.items$.pipe(
    map(items =>
      (items || []).reduce((acc, it: any) => {
        const price = Number(it?.price) || 0;
        const qty = Number(it?.qty) || 1;
        return acc + price * qty;
      }, 0)
    )
  );

  // Estado para abrir/cerrar el dropdown por clic
  isCartOpen = false;

  constructor(
    public cartService: CartService,
    public currencyService: CurrencyService,
    public languageService: LanguageService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Exponemos el contador reactivo y sincronizamos por si ya hay items guardados
    this.cartCount$ = this.cartService.count$;
    this.cartService.syncFromStorage();
  }

  // Alterna el estado del dropdown cuando se hace clic en el ícono del carrito
  toggleCart(event: Event): void {
    event.preventDefault();
    this.isCartOpen = !this.isCartOpen;
  }

  // Cierra el dropdown si se hace clic fuera del header
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isCartOpen = false;
    }
  }
  // Helpers para normalizar ID y llamar al servicio desde la plantilla
  getItemId(it: any): string | number | undefined {
    return it && (it._id ?? it.id);
  }

  inc(it: any): void {
    const id = this.getItemId(it);
    if (id !== undefined && id !== null) {
      this.cartService.increment(id);
    }
  }

  dec(it: any): void {
    const id = this.getItemId(it);
    if (id !== undefined && id !== null) {
      this.cartService.decrement(id);
    }
  }

  rm(it: any): void {
    const id = this.getItemId(it);
    if (id !== undefined && id !== null) {
      this.cartService.remove(id);
    }
  }
}
