  import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
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
  getSpecificUser(searchObject: any): Observable<User[]> {
    const params = new HttpParams()
      .set('username', searchObject.searchBy === 'username' ? searchObject.searchInput : '')
      .set('userProfile', searchObject.searchBy === 'userProfile' ? searchObject.searchInput : '')
      .set('email', searchObject.searchBy === 'email' ? searchObject.searchInput : '');
    return this.http.get<User[]>(`${environment.backendServerPORT}/user/specific-user`, { params });
  }
    updateUser(userData) {
      return this.http.patch<any>(`${environment.backendServerPORT}/user/update-user`, userData,{observe:'response'})
    } 
    deleteUser(id:string) {
      return this.http.delete(`${environment.backendServerPORT}/user/delete-user/${id}`, )
    }
  }
