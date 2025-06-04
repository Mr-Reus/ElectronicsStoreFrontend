import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProductsService,
  ProductViewModel,
  ProductCreateDto,
  Supplier
} from './products.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent implements OnInit {
  isCollapsed = false;

  /** All fetched products */
  products: ProductViewModel[] = [];

  /** Supplier list for dropdown */
  suppliers: Supplier[] = [];

  /** Reactive form for create/edit */
  productForm!: FormGroup;

  /** Modal control flags */
  showProductModal = false;
  editMode = false;
  selectedProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
    this.loadProducts();
  }

  /** Build reactive form */
  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      brand: [''],
      supplierID: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  /** Fetch all suppliers */
  private loadSuppliers(): void {
    this.productsService.getSuppliers().subscribe({
      next: list => (this.suppliers = list),
      error: err => console.error('Failed to load suppliers', err)
    });
  }

  /** Fetch all products */
  private loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: list => (this.products = list),
      error: err => console.error('Failed to load products', err)
    });
  }

  /**
   * Open modal for add or edit.
   * If `prod` passed → edit mode; otherwise create mode.
   */
  openProductModal(prod?: ProductViewModel): void {
    this.editMode = !!prod;
    if (this.editMode && prod) {
      this.selectedProductId = prod.productID;
      this.productForm.setValue({
        name: prod.name,
        category: prod.category ?? '',
        brand: prod.brand ?? '',
        supplierID: prod.supplierID,
        price: prod.price,
        description: prod.description ?? ''
      });
    } else {
      this.selectedProductId = null;
      this.productForm.reset({
        name: '',
        category: '',
        brand: '',
        supplierID: null,
        price: 0,
        description: ''
      });
    }
    this.showProductModal = true;
  }

  /** Close and reset modal */
  closeProductModal(): void {
    this.showProductModal = false;
    this.editMode = false;
    this.selectedProductId = null;
    this.productForm.reset({
      name: '',
      category: '',
      brand: '',
      supplierID: null,
      price: 0,
      description: ''
    });
  }

  /** Submit handler for create/update */
  onSubmitProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const raw = this.productForm.value as {
      name: string;
      category: string;
      brand: string;
      supplierID: number;
      price: number;
      description: string;
    };

    const dto: ProductCreateDto = {
      name: raw.name,
      category: raw.category,
      brand: raw.brand,
      supplierID: raw.supplierID,
      price: raw.price,
      description: raw.description
    };

    if (this.editMode && this.selectedProductId != null) {
      // Update existing
      this.productsService
        .updateProduct(this.selectedProductId, dto)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeProductModal();
          },
          error: err => console.error('Update failed', err)
        });
    } else {
      // Create new
      this.productsService.createProduct(dto).subscribe({
        next: () => {
          this.loadProducts();
          this.closeProductModal();
        },
        error: err => console.error('Create failed', err)
      });
    }
  }

  /** Delete a product */
  deleteProduct(id: number): void {
    if (!confirm(`Delete product #${id}?`)) {
      return;
    }
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error('Delete failed', err)
    });
  }

  /** Sidebar toggler */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /** Current user for welcome card */
  get currentUser() {
    return this.authService.currentUser;
  }

  /** Role check helper */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /** Logout button */
  logout(): void {
    this.authService.logout();
  }
}
