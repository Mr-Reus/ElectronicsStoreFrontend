import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthUser {
  userId: number;
  username: string;
  passwordHash?: string;
  email?: string;
  roleId?: number;
  roleName?: string; // optional: resolved via join for viewing
}

export interface UserRole {
  roleId: number;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:7106/api/admin'; // Adjust base URL if needed

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.baseUrl}/users`);
  }

  // Get all roles
  getRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.baseUrl}/roles`);
  }

  // Create a new user
  createUser(user: AuthUser): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.baseUrl}/users`, user);
  }

  // Update an existing user
  updateUser(userId: number, user: AuthUser): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}`, user);
  }

  // Delete a user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }
 exportData(format: 'csv' | 'xml' | 'json' | 'rdf'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }
}