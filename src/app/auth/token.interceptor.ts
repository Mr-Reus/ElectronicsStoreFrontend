import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
      const cloned = req.clone({ headers: req.headers.set('Authorization', `Bearer ${user.token}`) });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}