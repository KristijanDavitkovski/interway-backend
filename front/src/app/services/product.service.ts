import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'https://localhost:7143/api/products';

  constructor(private http: HttpClient) {}

  getAll(search = '', category = '', page = 1, pageSize = 10) {
    return this.http.get<{ total: number; data: Product[] }>(
      `${this.api}?search=${search}&category=${category}&page=${page}&pageSize=${pageSize}`
    );
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  create(product: FormData): Observable<Product> {
    console.log(product);
    return this.http.post<Product>(this.api, product); 
  }

  update(formData: FormData, id: number): Observable<any> {
  return this.http.put(`${this.api}/${id}`, formData);
}


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
