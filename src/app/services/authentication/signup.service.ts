import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Signup } from '../../shared/signup';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }
  postSignupData(userSignupData): Observable<HttpResponse<Signup>>{
    return this.http.post<Signup>(`${environment.backendServerPORT}/signup`, userSignupData, {observe:'response'})
  }
  
  //get all users
  getAllUsers(): Observable<Signup>{
    return  this.http.get<Signup>(`${environment.backendServerPORT}/users`)
  }
  
}
