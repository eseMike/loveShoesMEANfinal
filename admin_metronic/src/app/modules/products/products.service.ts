import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// ⚠️ Usa el MISMO import de environment que ya usas en categories.service.ts
import { environment } from 'src/environments/environment';

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  category?: string;  // se usará más adelante
  price?: number;     // se usará más adelante
  state?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private base = `${environment.apiUrl}/products`; // igual que categorías pero con /products

  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  // Paso 1 del curso: obtener listado (con búsqueda opcional)
  list(value: string = ''): Observable<Product[]> {
    const url = `${this.base}/list?value=${encodeURIComponent(value)}`;
    return this.http.get<Product[]>(url, this.authHeaders());
  }

  register(payload: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string; // _id de la categoría
}) {
  const url = `${this.base}/register`;
  return this.http.post<Product>(url, payload, this.authHeaders());
  }
  
  getOne(id: string) {
  const url = `${this.base}/query?_id=${encodeURIComponent(id)}`;
  return this.http.get<Product>(url, this.authHeaders());
}
}