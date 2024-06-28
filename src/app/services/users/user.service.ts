  import { HttpClient, HttpResponse } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { User } from '../../shared/user';
  import { environment } from '../../../environment';

  @Injectable({
    providedIn: 'root'
  })
  export class UserService {

    constructor(private http: HttpClient) { }
    //add user
    createNewUser(userObject): Observable<HttpResponse<User[]>> {
      return this.http.post<User[]>(`${environment.backendServerPORT}/user/create-user`, userObject, {observe: 'response'})
    }
   getAllUsers(page: number, size: number): Observable<any> {
    return this.http.get<{ users: User[], page: number, size: number, totalPages: number }>(
      `${environment.backendServerPORT}/all-users?page=${page}&size=${size}`
    );
  }
    //get users
    // getAllUsers() {
    //   return this.http.get<User>(`${environment.backendServerPORT}/user/all-users`)
    // }
    //get specific user
    // getSpecificUser(id:string) {
    //   return this.http.get<User>(`${environment.backendServerPORT}/user/id/:${id}`, {observe:'response'})
    // }
    // updateUser(userData) {
    //   return this.http.patch<User>(`${environment.backendServerPORT}/user/update-user`, userData,{observe:'response'})
    // }
    // deleteUser() {
    //   return this.http.delete(`${environment.backendServerPORT}/user/delete-user`)
    // }
  }
