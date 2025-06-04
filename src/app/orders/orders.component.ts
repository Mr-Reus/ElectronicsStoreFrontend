import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  OrdersService,
  Order,
  OrderCreateUpdateDto,
  Customer,
  Product
} from './orders.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  isCollapsed = false;

  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];

  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  completedOrders = 0;

  orderForm!: FormGroup;
  showOrderModal = false;
  editOrderMode = false;
  selectedOrder: Order | null = null;
  selectedOrderId: number | null = null;

  constructor(
    private ordersService: OrdersService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    this.loadProducts();
    this.loadOrders();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      customerID: [null, Validators.required],
      productID: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      orderDate: ['', Validators.required],
      paymentStatus: ['Pending', Validators.required]
    });
  }

  loadCustomers(): void {
  this.ordersService.getCustomers().subscribe({
    next: (list) => {
      // Convert each { customerID, firstName, lastName } into { customerId, firstName, lastName }
      this.customers = list.map(c => ({
        customerID: c.customerID,
        firstName:  c.firstName,
        lastName:   c.lastName
      }));
    },
    error: (err) => console.error('Failed to load customers', err)
  });
}
loadProducts(): void {
  this.ordersService.getProducts().subscribe({
    next: (rawList) => {
      const mapped: Product[] = rawList.map(p => ({
        productID: p.productID,
        name:      p.name
      }));
      this.products = mapped.filter((prod, idx, arr) =>
        arr.findIndex(x => x.name === prod.name) === idx
      );
    },
    error: (err) => console.error('Failed to load products', err)
  });
}
  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (olist) => {
        this.orders = olist;
        this.calculateSummary();
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  calculateSummary(): void {
    this.totalOrders = this.orders.length;
    this.totalRevenue = this.orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );
    this.pendingOrders = this.orders.filter(
      (o) => o.paymentStatus === 'Pending'
    ).length;
    this.completedOrders = this.orders.filter(
      (o) => o.paymentStatus === 'Paid'
    ).length;
  }

 openOrderModal(order?: Order): void {
   this.editOrderMode = !!order;
   this.selectedOrderId = order ? order.orderId : null;
  console.log('customers[] =', this.customers);
  console.log('products[]  =', this.products);

  if (order) {
    console.log('order.customerName =', order.customerName);
    console.log('order.productName  =', order.productName);
  } else {
    console.log('No order passed (Add mode).');
  }
     if (this.editOrderMode && order) {
const formattedDate = this.formatDateForInput(order.orderDate);
    // Look up the numeric IDs from the existing order’s “name” fields
    const custId = this.getCustomerIdByName(order.customerName);
    const prodId = this.getCustomerIdByName(order.customerName);

    console.log('Derived custId =', custId, 'prodId =', prodId);

      this.orderForm.patchValue({
  customerID:    custId,     // must be a number (not undefined)
  productID:     prodId,     // must be a number (not undefined)
  quantity:      order.quantity,
  orderDate:     formattedDate,
  paymentStatus: order.paymentStatus
});
    } else {
      this.orderForm.reset({
      customerId:    null,
      productId:     null,
      quantity:      1,
      orderDate:     this.currentDateForInput(),
      paymentStatus: 'Pending'
    });
    }
    this.showOrderModal = true;
  }

    private currentDateForInput(): string {
    // Returns "YYYY-MM-DDTHH:mm" so that <input type="datetime-local"> binds correctly
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }
  closeOrderModal(): void {
    this.showOrderModal = false;
    this.editOrderMode = false;
    this.selectedOrderId = null;
  }

  onSubmitOrder(): void {
    console.log(
      'onSubmitOrder called → formValue=',
      this.orderForm.value,
      'valid?',
      this.orderForm.valid
    );

    // 2) Extract raw values
    const raw = this.orderForm.value as {
      customerID:    number;
      productID:     number;
      quantity:      number;
      orderDate:     string;
      paymentStatus: string;
    };

    console.log(
      '  raw.customerId=', raw.customerID, typeof raw.customerID,
      ' raw.productId=', raw.productID, typeof raw.productID
    );

    // 3) Build DTO
    const dto: OrderCreateUpdateDto = {
      customerID:    raw.customerID,
      productID:     raw.productID,
      quantity:      raw.quantity,
      orderDate:     new Date(raw.orderDate).toISOString(),
      paymentStatus: raw.paymentStatus
    };
    console.log('  Sending DTO =', dto);

    if (this.editOrderMode && this.selectedOrderId != null) {
    console.log(
      'Updating order ID=', this.selectedOrderId,
      'with DTO=', dto
    );
    this.ordersService.updateOrder(this.selectedOrderId, dto).subscribe({
      next: () => {
        console.log('Update succeeded for order', this.selectedOrderId);
        this.loadOrders();
        this.afterSubmitCleanup();
      },
      error: (err) => console.error('Update failed', err)
    });
  } else {
    console.log('Creating new order with DTO=', dto);
    this.ordersService.createOrder(dto).subscribe({
      next: () => {
        console.log('Create succeeded');
        this.loadOrders();
        this.afterSubmitCleanup();
      },
      error: (err) => console.error('Create failed', err)
    });
   }
  }
    private afterSubmitCleanup(): void {
    this.closeOrderModal();
    // Reset form so next “Add” is fresh:
    this.orderForm.reset({
      customerId:    null,
      productId:     null,
      quantity:      1,
      orderDate:     this.currentDateForInput(),
      paymentStatus: 'Pending'
    });
    console.log('  Form reset after submit:', this.orderForm.value);
  }

  deleteOrder(order: Order): void {
    if (!confirm(`Delete order #${order.orderId}?`)) {
      return;
    }
    this.ordersService.deleteOrder(order.orderId).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Delete order failed', err)
    });
  }

  // Utility: match customerName back to ID
private getCustomerIdByName(name: string): number {
  const target = name.trim().toLowerCase();
  const found = this.customers.find(c => {
    const full = `${c.firstName} ${c.lastName}`.trim().toLowerCase();
    return full === target;
  });
  return found ? found.customerID : 0;
}

private getProductIdByName(name: string): number {
  const target = name.trim().toLowerCase();
  const found = this.products.find(p =>
    p.name.trim().toLowerCase() === target
  );
  return found ? found.productID : 0;
}


  // Format ISO string for <input type="datetime-local">
  private formatDateForInput(iso: string): string {
    const dt = new Date(iso);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const yyyy = dt.getFullYear();
    const MM = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const hh = pad(dt.getHours());
    const mi = pad(dt.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mi}`;
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

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}