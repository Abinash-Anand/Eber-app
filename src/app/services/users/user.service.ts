  import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, catchError, throwError } from 'rxjs';
  import { User } from '../../shared/user';
  import { environment } from '../../../environment';

  @Injectable({
    providedIn: 'root'
  })
  export class UserService {

    constructor(private http: HttpClient) { }
    //add user
    createNewUser(userObject): Observable<HttpResponse<User[]>> {
      return this.http.post<User[]>(`${environment.backendServerPORT}/user/create-user`, userObject, {observe: 'response'}).pipe(
      catchError(this.handleError)
    );
    }

    private handleError(error: HttpErrorResponse) {
    return throwError(() => error); // Propagate the error
  }
    
 getAllUsers(page: number, size: number, sortBy: string, sortOrder: string): Observable<any> {
    return this.http.get<{ users: User[], page: number, size: number, totalPages: number }>(
      `${environment.backendServerPORT}/all-users?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
}

    
    //=========sorting using server===========

   sortAllUsers(page: number, size: number, sortBy: string, sortOrder:string): Observable<any> {
  return this.http.get<{ users: User[], page: number, size: number, totalPages: number }>(
    `${environment.backendServerPORT}/users/sorted-table/all-users?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    {observe:'response'}
  );
}

    
    //get users
    // getAllUsers() {
    //   return this.http.get<User>(`${environment.backendServerPORT}/user/all-users`)
    // }
    //get specific user
  getSpecificUser(searchObject:any): Observable<any> {
    // Construct HttpParams with search criteria
    let params = new HttpParams()
      .set('filter', searchObject.searchBy)
      .set('value', searchObject.searchInput);

    return this.http.get<User>(`${environment.backendServerPORT}/user/specific-user`, { params, observe: 'response' });
  
  }
    updateUser(userData):Observable<HttpResponse<any>> {
      return this.http.patch<any>(`${environment.backendServerPORT}/user/update-user`, userData,{observe:'response'})
    } 
    deleteUser(id:string) {
      return this.http.delete(`${environment.backendServerPORT}/user/delete-user/${id}`,{observe:'response'} )
    }
  }
