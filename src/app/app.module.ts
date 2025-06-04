import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RoleGuard } from './auth/role.guard';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthService } from './auth/auth.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { OrdersComponent } from './orders/orders.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ProductsComponent } from './products/products.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { ReportingComponent } from './reporting/reporting.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminDashboardComponent,
    AuditLogsComponent,
    OrdersComponent,
    InventoryComponent,
    ProductsComponent,
    CustomerManagementComponent,
    ReportingComponent,
    ManagerDashboardComponent,
    EmployeeDashboardComponent,
    SupportDashboardComponent,
    AnalyticsDashboardComponent
  ],
  imports: [
    BrowserModule,
     FormsModule,
     ReactiveFormsModule,
     HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthService,AuthGuard,RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
