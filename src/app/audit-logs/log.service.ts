import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserLog {
  logID: number;
  userID?: number;
  username: string;
  action: string;
  tableName: string;
  recordID?: number;
  timestamp: string; // ISO‐formatted date/time
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly apiBase = 'https://localhost:7106/api/admin';

  constructor(private http: HttpClient) { }

  getLogs(): Observable<UserLog[]> {
    return this.http.get<UserLog[]>(`${this.apiBase}/audit-logs`);
  }
}
