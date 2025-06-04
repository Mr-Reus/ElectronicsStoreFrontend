import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    isCollapsed = false;
  constructor(private authService: AuthService, private router: Router) {}
  get currentUser() {
    return this.authService.currentUser;
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
  logout() {
    this.authService.logout(); // Clears localStorage, navigates to login
  }
   toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}