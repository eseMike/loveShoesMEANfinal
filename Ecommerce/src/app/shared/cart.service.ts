import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  _id?: string;
  name?: string;
  price?: number;
  qty?: number;
  image?: string; // URL/relative path de imagen del producto
  // agrega aquí los campos que uses en tu app
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart';

  private _count$ = new BehaviorSubject<number>(0);
  public readonly count$ = this._count$.asObservable();

  private _items$ = new BehaviorSubject<CartItem[]>([]);
  public readonly items$ = this._items$.asObservable();

  constructor() {
    this.syncFromStorage();
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY) this.syncFromStorage();
    });
  }

  public syncFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const items: CartItem[] = raw ? JSON.parse(raw) : [];
      this._items$.next(items);

      const count = Array.isArray(items)
        ? items.reduce((acc, it) => acc + (Number(it?.qty) > 0 ? Number(it.qty) : 1), 0)
        : 0;

      this._count$.next(count);
    } catch {
      this._items$.next([]);
      this._count$.next(0);
    }
  }

  public getCountSnapshot(): number {
    return this._count$.value;
  }

  public saveItemsToStorage(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.syncFromStorage();
  }

  /** Devuelve una copia del arreglo actual de items (sincrónico) */
  public getItemsSnapshot(): CartItem[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    try {
      const items: CartItem[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? [...items] : [];
    } catch {
      return [];
    }
  }

  /** +1 a la cantidad; si no existe, no hace nada (add se maneja fuera) */
  public increment(id: string | number): void {
    const items = this.getItemsSnapshot();
    const idx = items.findIndex(it => String(it._id) === String(id));
    if (idx >= 0) {
      const current = Number(items[idx].qty) || 1;
      items[idx].qty = current + 1;
      this.saveItemsToStorage(items);
    }
  }

  /** -1 a la cantidad; si queda en 0, elimina el ítem */
  public decrement(id: string | number): void {
    const items = this.getItemsSnapshot();
    const idx = items.findIndex(it => String(it._id) === String(id));
    if (idx >= 0) {
      const current = Number(items[idx].qty) || 1;
      const next = current - 1;
      if (next <= 0) {
        items.splice(idx, 1);
      } else {
        items[idx].qty = next;
      }
      this.saveItemsToStorage(items);
    }
  }

  /** Elimina el ítem directamente */
  public remove(id: string | number): void {
    const items = this.getItemsSnapshot().filter(it => String(it._id) !== String(id));
    this.saveItemsToStorage(items);
  }

  /** Vacía por completo el carrito */
  public clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.syncFromStorage();
  }
}
