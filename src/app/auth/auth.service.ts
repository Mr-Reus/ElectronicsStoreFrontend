import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) this.userSubject.next(JSON.parse(storedUser));
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>('https://localhost:7106/api/auth/login', credentials).pipe(
      tap(user => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }


  logout() {
  const user = this.currentUser;
  if (user) {
    this.http.post('https://localhost:7106/api/auth/logout', {
      userId: user.userId,
      username: user.username
    }).subscribe(); // Log user logout on server
  }

  localStorage.removeItem('user');
  this.userSubject.next(null);
  this.router.navigate(['/']);
}

  get currentUser() {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  getToken(): string | null {
    return this.currentUser?.token || null;
  }
}