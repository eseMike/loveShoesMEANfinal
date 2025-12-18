import { Component, ElementRef, HostListener } from '@angular/core';
import { CartService } from '../cart.service';
import { CurrencyService } from '../currency.service';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  get cartCount(): number {
    return this.cartService.count;
  }

  get items() {
    return this.cartService.items;
  }

  get subtotal(): number {
    return this.cartService.subtotals;
  }

  isCartOpen = false;

  constructor(
    public cartService: CartService,
    public currencyService: CurrencyService,
    public languageService: LanguageService,
    private el: ElementRef
  ) {}

  toggleCart(event: Event): void {
    event.preventDefault();
    this.isCartOpen = !this.isCartOpen;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isCartOpen = false;
    }
  }

  getItemId(it: any): string | undefined {
    const id = it && (it._id ?? it.id);
    return id !== undefined && id !== null ? String(id) : undefined;
  }

  inc(it: any): void {
    const id = this.getItemId(it);
    if (id !== undefined) {
      this.cartService.increment(id);
    }
  }

  dec(it: any): void {
    const id = this.getItemId(it);
    if (id !== undefined) {
      this.cartService.decrement(id);
    }
  }

  rm(it: any): void {
    const id = this.getItemId(it);
    if (id !== undefined) {
      this.cartService.remove(id);
    }
  }
}
