import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** View‐models / DTOs for reporting data **/

export interface SalesRecord {
  fullDate: string;       // e.g. "2024-05-03"
  productName: string;
  quantity: number;
  totalAmount: number;
  netAmount: number;
}

export interface InventorySnapshot {
  fullDate: string;      // e.g. "2024-05-03"
  productName: string;
  warehouseLocation: string;
  quantityInStock: number;
}

export interface UserLogRecord {
  timestamp: string;     // e.g. "2024-05-03T14:22:00"
  username: string;
  action: string;
  tableName: string;
}

export interface SalesTrend {
  monthLabel: string;    // e.g. "2024-05"
  totalSales: number;
}

export interface StockTrend {
  weekEnd: string;       // e.g. "2024-05-03"
  avgQuantity: number;
}

export interface SalesOrderRecord {
  orderId: number;
  orderDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  totalAmount: number;
}

export interface CustomerTrend {
  monthLabel: string;    // e.g. "2024-05"
  newCustomers: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private baseUrl = 'https://localhost:7106/api/reports';

  constructor(private http: HttpClient) {}

  // ─── Admin endpoints ─────────────────────────────────────────────────

  getAllSales(): Observable<SalesRecord[]> {
    return this.http.get<SalesRecord[]>(`${this.baseUrl}/sales`);
  }

  getAllInventory(): Observable<InventorySnapshot[]> {
    return this.http.get<InventorySnapshot[]>(`${this.baseUrl}/inventory`);
  }

  getUserLogs(): Observable<UserLogRecord[]> {
    return this.http.get<UserLogRecord[]>(`${this.baseUrl}/userlogs`);
  }

  // ─── Manager endpoints ────────────────────────────────────────────────

  getMonthlySalesTrend(): Observable<SalesTrend[]> {
    return this.http.get<SalesTrend[]>(`${this.baseUrl}/trends/sales/monthly`);
  }

  getWeeklyStockTrend(): Observable<StockTrend[]> {
    return this.http.get<StockTrend[]>(`${this.baseUrl}/trends/stock/weekly`);
  }

  // ─── Analyst endpoints ────────────────────────────────────────────────

  getSalesOrdersOverview(): Observable<SalesOrderRecord[]> {
    return this.http.get<SalesOrderRecord[]>(`${this.baseUrl}/overview/salesorders`);
  }

  getCustomerGrowthTrend(): Observable<CustomerTrend[]> {
    return this.http.get<CustomerTrend[]>(`${this.baseUrl}/trends/customers/monthly`);
  }
}