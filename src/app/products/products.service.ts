import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** ViewModel returned by GET /api/products */
export interface ProductViewModel {
  productID: number;
  name: string;
  category?: string;
  brand?: string;
  supplierID: number;
  supplierName: string;
  price: number;
  description?: string;
}

/** DTO for create/update product */
export interface ProductCreateDto {
  name: string;
  category?: string;
  brand?: string;
  supplierID: number;
  price: number;
  description?: string;
}

/** Supplier entity (for dropdown) */
export interface Supplier {
  supplierID: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'https://localhost:7106/api'; // adjust as needed

  constructor(private http: HttpClient) {}

  /** GET all products (with supplier-join) */
  getProducts(): Observable<ProductViewModel[]> {
    return this.http.get<ProductViewModel[]>(`${this.baseUrl}/products`);
  }

  /** GET all suppliers */
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/suppliers`);
  }

  /** POST new product */
  createProduct(dto: ProductCreateDto): Observable<ProductViewModel> {
    return this.http.post<ProductViewModel>(`${this.baseUrl}/products`, dto);
  }

  /** PUT to update existing */
  updateProduct(id: number, dto: ProductCreateDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, dto);
  }

  /** DELETE a product */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }
}