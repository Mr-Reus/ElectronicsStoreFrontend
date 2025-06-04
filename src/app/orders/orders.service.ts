// orders.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  orderId: number;
  orderDate: string;       // ISO date string
  customerName: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
}

export interface OrderCreateUpdateDto {
  customerID: number;
  productID: number;
  quantity: number;
  orderDate: string;       // ISO date string, e.g. "2025-06-01T10:30"
  paymentStatus: string;
}

export interface Customer {
  customerID: number;
  firstName: string;
  lastName: string;
}

export interface Product {
  productID: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = 'https://localhost:7106/api'; // Adjust if necessary

  constructor(private http: HttpClient) {}

  // Fetch all orders (join: Customer, Product, Payment)
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  // Create a new order
  createOrder(dto: OrderCreateUpdateDto): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, dto);
  }

  // Update an existing order
  updateOrder(orderId: number, dto: OrderCreateUpdateDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}`, dto);
  }

  // Delete an order
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/orders/${orderId}`);
  }

  // Fetch all customers for dropdown
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  // Fetch all products for dropdown
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/all-products`);
  }
}
