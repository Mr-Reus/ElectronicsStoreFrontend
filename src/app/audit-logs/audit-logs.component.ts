import { Component, OnInit } from '@angular/core';
import { LogService, UserLog } from '../audit-logs/log.service'
import { AuthService } from '../auth/auth.service';
import * as bootstrap from 'bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-audit-logs',
  standalone: false,
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent implements OnInit {
  isCollapsed = false;
  logs: UserLog[] = [];
  filteredLogs: UserLog[] = [];
  pagedLogs: UserLog[] = [];
  filterText: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pagesArray: number[] = [];

  // Sorting
  currentSortField: keyof UserLog = 'logID';
  sortAsc = true;

  constructor(
    private logService: LogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.logService.getLogs().subscribe(data => {
      this.logs = data;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const text = this.filterText.toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      log.username.toLowerCase().includes(text) ||
      log.action.toLowerCase().includes(text) ||
      log.tableName.toLowerCase().includes(text)
    );
    this.applySort();
    this.initPagination();
  }

  initPagination(): void {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize) || 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    this.pagedLogs = this.filteredLogs.slice(start, start + this.pageSize);
  }

  sort(field: keyof UserLog): void {
    if (this.currentSortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.currentSortField = field;
      this.sortAsc = true;
    }
    this.applySort();
    this.changePage(1);
  }

  applySort(): void {
    this.filteredLogs.sort((a, b) => {
      const aVal = a[this.currentSortField] as any;
      const bVal = b[this.currentSortField] as any;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return this.sortAsc ? -1 : 1;
      if (aVal > bVal) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  sortIcon(field: keyof UserLog): string {
    if (this.currentSortField !== field) return '';
    return this.sortAsc ? 'sort-up' : 'sort-down';
  }

  refresh(): void {
    this.loadLogs();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
