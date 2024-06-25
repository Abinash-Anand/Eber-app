import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Signup } from '../../shared/signup';
import { environment } from '../../../environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginStatus: boolean = false;
  login() {
    if (this.loginStatus === true) {
      return this.loginStatus
    } else {
      this.router.navigate(['/'])
    }
  }
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  loginUser(user: { username: string, password:string}): Observable<HttpResponse<any>>{
    return this.http.post<any>(`${environment.backendServerPORT}/login`,user, {observe:'response'})
  }
}
