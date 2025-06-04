import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerViewModel {
  customerID:   number;
  firstName:    string;
  lastName:     string;
  email:        string;
  phoneNumber:  string;
  orderCount:   number;   // number of orders for that customer
}

export interface CustomerCreateUpdateDto {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'https://localhost:7106/api/customers';

  constructor(private http: HttpClient) {}

  // GET /api/customers → CustomerViewModel[]
  getAll(): Observable<CustomerViewModel[]> {
    return this.http.get<CustomerViewModel[]>(`${this.baseUrl}/all`);
  }

  // POST /api/customers → creates new customer
  create(dto: CustomerCreateUpdateDto): Observable<CustomerViewModel> {
    return this.http.post<CustomerViewModel>(`${this.baseUrl}`, dto);
  }

  // PUT /api/customers/{id}
  update(id: number, dto: CustomerCreateUpdateDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  // DELETE /api/customers/{id}
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
