

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'currency_code';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private _currency$ = new BehaviorSubject<string>(this.readInitial());
  /** Observable con el código de moneda actual (p.ej. 'USD', 'MXN') */
  readonly currency$ = this._currency$.asObservable();

  /** Valor actual sincronamente */
  get current(): string {
    return this._currency$.value;
  }

  /** Cambia la moneda y la persiste */
  setCurrency(code: string) {
    const norm = (code || 'USD').toUpperCase();
    localStorage.setItem(STORAGE_KEY, norm);
    this._currency$.next(norm);
  }

  /** Lee valor inicial de localStorage o usa 'USD' por defecto */
  private readInitial(): string {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? saved.toUpperCase() : 'USD';
    // luego podremos cambiar el default a 'MXN' si el cliente lo pide
  }
}
