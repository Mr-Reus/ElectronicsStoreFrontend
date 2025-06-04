import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import {AuditLogsComponent} from './audit-logs/audit-logs.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { OrdersComponent } from './orders/orders.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ProductsComponent } from './products/products.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { ReportingComponent } from './reporting/reporting.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';

const routes: Routes = [  
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {  path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin'] }  },
  {  path: 'audit-logs', component: AuditLogsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin'] }  },
  { path: 'orders', component: OrdersComponent,canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin', 'Manager', 'Employee'] }},
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Manager', 'Employee'] }
  },
  {
    path: 'customer-management',
    component: CustomerManagementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Support'] }
  },
  {
    path: 'reporting',
    component: ReportingComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Manager', 'Analyst'] }
  },

  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Manager'] }
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Employee'] }
  },
  {
    path: 'support-dashboard',
    component: SupportDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Support'] }
  },
  {
    path: 'analytics-dashboard',
    component: AnalyticsDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Analyst'] }
  },

  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
