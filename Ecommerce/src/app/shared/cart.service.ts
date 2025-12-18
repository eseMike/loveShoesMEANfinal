import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _items = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items.asObservable();

  // ===== streams derivados =====
  count$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  subtotals$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  );

  constructor() {}

  // ===== getters usados por header / componentes =====
  get items(): CartItem[] {
    return this._items.value;
  }

  get count(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotals(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // ===== acciones =====
  addProduct(product: any): void {
    const items = [...this.items];
    const existing = items.find(i => i._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        _id: product._id,
        title: product.title || product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }

    this._items.next(items);
  }

  addItem(item: CartItem): void {
    const items = [...this.items];
    const existing = items.find(i => i._id === item._id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push({ ...item });
    }

    this._items.next(items);
  }

  increment(id: string): void {
    const items = [...this.items];
    const item = items.find(i => i._id === id);
    if (item) {
      item.quantity += 1;
      this._items.next(items);
    }
  }

  decrement(id: string): void {
    const items = [...this.items];
    const item = items.find(i => i._id === id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.remove(id);
      } else {
        this._items.next(items);
      }
    }
  }

  remove(id: string): void {
    const items = this.items.filter(i => i._id !== id);
    this._items.next(items);
  }

  clear(): void {
    this._items.next([]);
  }
}
