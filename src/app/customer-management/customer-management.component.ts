import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CustomerService,
  CustomerViewModel
} from './customer.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-customer-management',
  standalone: false,
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {
  isCollapsed = false;

  customers: CustomerViewModel[] = [];
  totalCustomers = 0;
  totalOrdersAcrossAll = 0;

  customerForm!: FormGroup;
  showCustomerModal = false;
  editMode = false;
  selectedCustomer: CustomerViewModel | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCustomers();
  }

  buildForm(): void {
    this.customerForm = this.fb.group({
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (list) => {
        // Each CustomerViewModel includes customerID, firstName, lastName, email, phoneNumber, orderCount
        this.customers = list;
        this.calculateSummary();
      },
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  calculateSummary(): void {
    this.totalCustomers = this.customers.length;
    this.totalOrdersAcrossAll = this.customers
      .reduce((sum, c) => sum + (c.orderCount || 0), 0);
  }

  openCustomerModal(cust?: CustomerViewModel): void {
    this.editMode = !!cust;
    this.selectedCustomer = cust || null;

    if (this.editMode && cust) {
      // Prefill form with selected customer’s data
      this.customerForm.patchValue({
        firstName:   cust.firstName,
        lastName:    cust.lastName,
        email:       cust.email,
        phoneNumber: cust.phoneNumber
      });
    } else {
      // New customer: reset fields
      this.customerForm.reset({
        firstName:   '',
        lastName:    '',
        email:       '',
        phoneNumber: ''
      });
    }
    this.showCustomerModal = true;
  }

  closeCustomerModal(): void {
    this.showCustomerModal = false;
    this.editMode = false;
    this.selectedCustomer = null;
    this.customerForm.reset({
      firstName:   '',
      lastName:    '',
      email:       '',
      phoneNumber: ''
    });
  }

  onSubmitCustomer(): void {
    if (this.customerForm.invalid) {
      return;
    }
    const raw = this.customerForm.value as {
      firstName:   string;
      lastName:    string;
      email:       string;
      phoneNumber: string;
    };

    const dto = {
      firstName: raw.firstName.trim(),
      lastName:  raw.lastName.trim(),
      email:     raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim()
    };

    if (this.editMode && this.selectedCustomer) {
      // UPDATE existing customer
      this.customerService
        .update(this.selectedCustomer.customerID, dto)
        .subscribe({
          next: () => {
            this.loadCustomers();
            this.closeCustomerModal();
          },
          error: (err) => console.error('Update failed', err)
        });
    } else {
      // CREATE new customer
      this.customerService.create(dto).subscribe({
        next: () => {
          this.loadCustomers();
          this.closeCustomerModal();
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  deleteCustomer(id: number): void {
    if (!confirm(`Delete customer #${id}?`)) {
      return;
    }
    this.customerService.delete(id).subscribe({
      next: () => this.loadCustomers(),
      error: (err) => console.error('Delete failed', err)
    });
  }

  // Sidebar toggle
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // For template: user/role info
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