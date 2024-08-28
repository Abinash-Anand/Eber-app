// spinner.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.show();  // Show the spinner in the foreground before the HTTP request is made

    return next.handle(request).pipe(
      delay(500),  // Optional: Add a small delay to ensure the spinner is visible
      finalize(() => this.spinner.hide())  // Hide the spinner after the HTTP request is completed
    );
  }
}
