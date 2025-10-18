import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Category {
  _id?: string;
  name: string;
  description: string;
  state?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
 private base = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': token, // tu backend usa este header
      }),
    };
  }

  // GET /api/categories/list?value=
  list(value: string = ''): Observable<Category[]> {
  const url = `${this.base}/list?value=${encodeURIComponent(value)}`;
  const token = localStorage.getItem('token');
  console.log('[CategoriesService] GET ->', url, ' | token?', !!token);
  return this.http.get<Category[]>(url, this.authHeaders());
}

  // POST /api/categories/register
  register(body: Pick<Category, 'name' | 'description'>): Observable<Category> {
    return this.http.post<Category>(`${this.base}/register`, body, this.authHeaders());
  }

  // PUT /api/categories/update
  update(body: Pick<Category, '_id' | 'name' | 'description'>): Observable<Category> {
    return this.http.put<Category>(`${this.base}/update`, body, this.authHeaders());
  }

  // PUT /api/categories/deactivate
  deactivate(id: string): Observable<Category> {
    return this.http.put<Category>(`${this.base}/deactivate`, { _id: id }, this.authHeaders());
  }

  // PUT /api/categories/activate
  activate(id: string): Observable<Category> {
    return this.http.put<Category>(`${this.base}/activate`, { _id: id }, this.authHeaders());
  }
getOne(id: string) {
  const url = `${this.base}/query`;
  console.log('[CategoriesService] GET one ->', url, 'params _id=', id);
  return this.http.get<Category>(url, {
    ...this.authHeaders(),
    params: { _id: id }   // 👈 enviamos _id como query param
  });
}
  
  remove(id: string) {
  const url = `${this.base}/remove/${encodeURIComponent(id)}`;
  console.log('[CategoriesService] DELETE ->', url);
  return this.http.delete<{ message: string }>(url, this.authHeaders());
} 
}  