import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  InventoryService,
  InventoryItem,
  StockUpdateDto
} from './inventory.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  isCollapsed = false;

  /** The full inventory list from the server. */
  inventory: InventoryItem[] = [];

  /** Two summary values: total number of products & how many are low-stock. */
  totalProducts = 0;
  lowStockCount = 0;

  /** When “Adjust Stock” is clicked, we assign this and open the modal. */
  selectedItem: InventoryItem | null = null;
  showAdjustModal = false;

  /** Reactive form for adjusting stock. */
  adjustForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initAdjustForm();
    this.loadInventory();
  }

  /** Build the reactive form that updates quantity & lastUpdated. */
  private initAdjustForm(): void {
    this.adjustForm = this.fb.group({
      quantityInStock: [null, [Validators.required, Validators.min(0)]],
      lastUpdated: ['', Validators.required]
    });
  }

  /** 
   * Call the service to fetch all inventory rows, then recalc the summaries.
   */
  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (list) => {
        this.inventory = list;
        this.calculateSummaries();
      },
      error: (err) => console.error('Failed to load inventory', err)
    });
  }

  /** Recompute totalProducts and lowStockCount (e.g. threshold < 10). */
  private calculateSummaries(): void {
    this.totalProducts = this.inventory.length;
    this.lowStockCount = this.inventory.filter(item => item.quantityInStock < 10).length;
  }

  /**
   * Open “Adjust Stock” modal for a given inventory item
   */
  openAdjustModal(item: InventoryItem): void {
    this.selectedItem = item;

    // Prepopulate the form with existing values:
    const isoOnlyDateTime = this.formatForDateTimeLocal(item.lastUpdated);
   console.log('Time before function :', item.lastUpdated);
    console.log('Time after function :', isoOnlyDateTime);
    this.adjustForm.setValue({
      quantityInStock: item.quantityInStock,
      lastUpdated: isoOnlyDateTime
    });

    this.showAdjustModal = true;
  }

  /** Close and reset the adjust‐stock modal. */
  closeAdjustModal(): void {
    this.showAdjustModal = false;
    this.selectedItem = null;
    this.adjustForm.reset({
      quantityInStock: null,
      lastUpdated: ''
    });
  }

  /**
   * When “Save Changes” is clicked, submit the new stock to the API.
   */
  onSubmitAdjust(): void {
    if (!this.selectedItem) {
      console.warn('No item selected; aborting adjust.');
      return;
    }
    if (this.adjustForm.invalid) {
      console.warn('Adjust form invalid; not submitting.');
      return;
    }

    const raw = this.adjustForm.value as {
      quantityInStock: number;
      lastUpdated: string;
    };
    
    console.log('Time before submiting :', this.adjustForm.value.lastUpdated);
    const isoUtc = raw.lastUpdated + ":00.000Z";  
     console.log('Sending as UTC 14:30:', isoUtc);
    const dto: StockUpdateDto = {
    quantityInStock: raw.quantityInStock,
    lastUpdated: isoUtc    // "2024-05-04T14:30:00.000Z"
  };

    console.log('Time after submiting :', dto.lastUpdated);
    // Call service:
    this.inventoryService
      .updateStock(this.selectedItem.productId, dto)
      .subscribe({
        next: () => {
          // Refresh the inventory list immediately:
          this.loadInventory();
          this.closeAdjustModal();
        },
        error: (err) => console.error('Failed to update stock', err)
      });
  }

  /** Convert an ISO string → “YYYY‐MM‐DDThh:mm” for <input type="datetime-local"> */
  private formatForDateTimeLocal(iso: string): string {
    const dt = new Date(iso);
    const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
    const yyyy = dt.getFullYear();
    const MM = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const hh = pad(dt.getHours());
    const mi = pad(dt.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mi}`;
  }

  /** Sidebar toggler */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /** For the template: current user info comes from AuthService */
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
