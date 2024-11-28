import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 假設 Token 來自本地存儲
    const token = localStorage.getItem('Token');

    if (token) {
      console.log('Token', token);
      // 複製請求並添加授權 Header
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      tap((event:HttpEvent<any>) =>{
        if (event instanceof HttpResponse) {
          const data = event.body;
          const newToken = data.Token;
          if (newToken) {
            localStorage.setItem('Token', `${newToken}`);
          }
        }
      }),
      catchError((res) => {
        this.router.navigate(['']);
        return throwError(() => res);
      })
    );
  }
}
