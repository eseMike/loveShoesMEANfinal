

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'language_code';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang$ = new BehaviorSubject<string>(this.readInitial());
  /** Observable con el idioma actual (p. ej. 'es-419', 'en-US') */
  readonly lang$ = this._lang$.asObservable();

  /** Valor actual sincronamente */
  get current(): string {
    return this._lang$.value;
  }

  /** Cambia el idioma y lo persiste */
  setLanguage(code: string) {
    const norm = code || 'en-US';
    localStorage.setItem(STORAGE_KEY, norm);
    this._lang$.next(norm);
  }

  /** Lee valor inicial de localStorage o usa 'en-US' por defecto */
  private readInitial(): string {
    return localStorage.getItem(STORAGE_KEY) || 'en-US';
  }
}
