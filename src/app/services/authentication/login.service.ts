import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  loginStatus$ = this.loginStatusSubject.asObservable();

  get isLoggedIn() {
    return this.loginStatusSubject.value;
  }

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    try {
      return !!localStorage.getItem('token');
    } catch (e) {
      console.warn('localStorage is not available. Using in-memory storage.');
      return false;
    }
  }

  logoutUser() {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.warn('localStorage is not available.');
    }
    this.setLoginStatus(false);
    this.router.navigate(['/login']);
    console.log("session expired");
  }

  setLoginStatus(status: boolean) {
    this.loginStatusSubject.next(status);
  }

  loginUser(user: { username: string, password: string }): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${environment.backendServerPORT}/login`, user, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
