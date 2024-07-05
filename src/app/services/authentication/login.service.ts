import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Signup } from '../../shared/signup';
import { environment } from '../../../environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  get isLoggedIn() {
    return this.loginStatusSubject.value;
  }

  constructor(private http: HttpClient, private router: Router) { }

  logoutUser() {
    // Clear token from local storage or wherever it's stored
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirect to login page after logout
    console.log("session expired");
    this.setLoginStatus(false); // Update login status
  }

  setLoginStatus(status: boolean) {
    this.loginStatusSubject.next(status); // Emit login status
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
    return throwError(() => error); // Propagate the error
  }
}
