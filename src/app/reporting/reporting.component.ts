import { Component, OnInit } from '@angular/core';
import { ReportingService,
         SalesRecord,
         InventorySnapshot,
         UserLogRecord,
         SalesTrend,
         StockTrend,
         SalesOrderRecord,
         CustomerTrend } from '../reporting/reporting.service';
import { AuthService } from '../auth/auth.service';
import * as powerbi from 'powerbi-client';

@Component({
  selector: 'app-reporting',
  standalone: false,
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss'
})
export class ReportingComponent implements OnInit {
  isCollapsed = false;

  // Admin reports
  salesReport: SalesRecord[] = [];
  inventoryReport: InventorySnapshot[] = [];
  userLogReport: UserLogRecord[] = [];

  // Manager analytics
  monthlySalesTrend: SalesTrend[] = [];
  weeklyStockTrend: StockTrend[] = [];

  // Analyst read-only tables
  salesOrdersReport: SalesOrderRecord[] = [];
  customerTrendReport: CustomerTrend[] = [];

  constructor(
    private reportingService: ReportingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Load Admin‐only reports
    if (this.hasRole('Admin')) {
      this.reportingService.getAllSales().subscribe({
        next: data => (this.salesReport = data),
        error: err => console.error('Failed to load sales report', err)
      });
      this.reportingService.getAllInventory().subscribe({
        next: data => (this.inventoryReport = data),
        error: err => console.error('Failed to load inventory report', err)
      });
      this.reportingService.getUserLogs().subscribe({
        next: data => (this.userLogReport = data),
        error: err => console.error('Failed to load user logs', err)
      });
    }

    // Load Manager‐only analytics
    if (this.hasRole('Manager')) {
      this.reportingService.getMonthlySalesTrend().subscribe({
        next: data => (this.monthlySalesTrend = data),
        error: err => console.error('Failed to load monthly sales trend', err)
      });
      this.reportingService.getWeeklyStockTrend().subscribe({
        next: data => (this.weeklyStockTrend = data),
        error: err => console.error('Failed to load weekly stock trend', err)
      });
    }

    // Load Analyst‐only tables
    if (this.hasRole('Analyst')) {
      this.reportingService.getSalesOrdersOverview().subscribe({
        next: data => (this.salesOrdersReport = data),
        error: err => console.error('Failed to load sales/orders overview', err)
      });
      this.reportingService.getCustomerGrowthTrend().subscribe({
        next: data => (this.customerTrendReport = data),
        error: err => console.error('Failed to load customer trend', err)
      });
    }
  }

  // Sidebar toggle
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // Auth + UI Helpers
  get currentUser() {
    return this.authService.currentUser;
  }
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
  logout(): void {
    this.authService.logout();
  }
}