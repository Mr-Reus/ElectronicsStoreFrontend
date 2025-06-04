import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService, AuthUser, UserRole} from '../admin-dashboard/admin.service';
import { AuthService } from '../auth/auth.service';
import * as bootstrap from 'bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  isCollapsed = false;
  users: AuthUser[] = [];
  roles: UserRole[] = [];

  userForm!: FormGroup;
  showUserModal = false;
  editMode = false;
  selectedUser: AuthUser | null = null;
  deleteModalRef?: NgbModalRef;

  @ViewChild('deleteModalTpl', { static: true }) deleteModalTpl!: TemplateRef<any>;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadRoles();
  }

  private initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', Validators.required],
      roleId: [null, Validators.required]
    });
  }

  private loadUsers() {
    this.adminService.getUsers().subscribe({
      next: u => this.users = u,
      error: err => console.error('Failed to load users', err)
    });
  }

  private loadRoles() {
    this.adminService.getRoles().subscribe({
      next: r => this.roles = r,
      error: err => console.error('Failed to load roles', err)
    });
  }

  getRoleName(roleId: number | undefined): string {
    const role = this.roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Unknown';
  }

  // Create / Edit
  openUserModal(user?: AuthUser) {
    this.editMode = !!user;
    this.selectedUser = user || null;

    if (this.editMode && user) {
      this.userForm.setValue({
        username: user.username,
        email: user.email || '',
        passwordHash: '',
        roleId: user.roleId || null
      });
    } else {
      this.userForm.reset();
    }
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const payload = this.userForm.value as AuthUser;

    const action$ = this.editMode && this.selectedUser
      ? this.adminService.updateUser(this.selectedUser.userId, payload)
      : this.adminService.createUser(payload);

    action$.subscribe({
      next: () => {
        this.loadUsers();
        this.closeUserModal();
      },
      error: err => console.error('Save failed', err)
    });
  }

  // Delete via ng-bootstrap
  deleteUser(user: AuthUser) {
    this.selectedUser = user;
    this.deleteModalRef = this.modalService.open(this.deleteModalTpl, { centered: true });
  }

  confirmDelete() {
    if (!this.selectedUser) return;
    this.adminService.deleteUser(this.selectedUser.userId)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.deleteModalRef?.close();
        },
        error: err => console.error('Delete failed', err)
      });
  }
 onExport(format: 'csv' | 'xml' | 'json' | 'rdf') {
    this.adminService.exportData(format).subscribe({
      next: blob => this.downloadBlob(blob, `export.${format}`),
      error: err => console.error(`Export ${format} failed`, err)
    });
  }

  /**
   * Create a temporary <a> tag to download a blob as a file.
   */
  private downloadBlob(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  // Auth + UI Helpers
  get currentUser() {
    return this.authService.currentUser;
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
