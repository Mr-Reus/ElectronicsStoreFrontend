import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * InventoryItem: a single row after joining Product, Supplier, ProductStock.
 */
export interface InventoryItem {
  productId: number;
  productName: string;
  supplierName: string;
  category: string;
  price: number;
  quantityInStock: number;
  lastUpdated: string; // ISO string
}

/**
 * StockUpdateDto: what we send to update a product’s stock.
 */
export interface StockUpdateDto {
  quantityInStock: number;
  lastUpdated: string; // ISO string, e.g. "2025-06-01T14:30:00Z"
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Adjust baseUrl if needed
  private baseUrl = 'https://localhost:7106/api/inventory';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all inventory rows (Product ↔ Supplier ↔ ProductStock).
   */
  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}`);
  }

  /**
   * Update the stock for a given productId.
   */
  updateStock(productId: number, dto: StockUpdateDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${productId}/stock`, dto);
  }
}
