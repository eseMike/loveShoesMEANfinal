import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ProductCategory {
  _id?: string;
  name?: string;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  state?: number;
}

export interface Product {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock?: number;
  category?: ProductCategory | string;
  images?: string[];
  badge?: string;
  oldPrice?: number;
  state?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  items?: Product[];
  data?: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = environment.URL_SERVICIOS + 'products';

  constructor(private http: HttpClient) {}

  list(params: { page?: number; limit?: number; q?: string } = {}): Observable<Product[]> {
    const httpParams = new HttpParams({
      fromObject: {
        page: (params.page ?? 1).toString(),
        limit: (params.limit ?? 10).toString(),
        q: params.q ?? '',
      },
    });

    return this.http
      .get<ProductListResponse | Product[]>(`${this.base}/list`, { params: httpParams })
      .pipe(
        map((res: any) => Array.isArray(res) ? res : (res?.items ?? res?.data ?? []))
      );
  }

  detail(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/detail/${id}`);
  }

  listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      environment.URL_SERVICIOS + 'categories'
    );
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const params = new HttpParams().set('category', categoryId);

    return this.http
      .get<ProductListResponse | Product[]>(`${this.base}/list`, { params })
      .pipe(
        map((res: any) =>
          Array.isArray(res) ? res : (res?.items ?? res?.data ?? [])
        )
      );
  }
}
