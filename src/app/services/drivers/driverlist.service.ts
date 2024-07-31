import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { User } from '../../shared/user';

@Injectable({
  providedIn: 'root'
})
export class DriverlistService {

  constructor(private http: HttpClient) { }
    //add user
    createNewUser(userObject): Observable<HttpResponse<User[]>> {
      return this.http.post<User[]>(`${environment.backendServerPORT}/driver/create-driver`, userObject, {observe: 'response'})
    }
   getAllUsers(page: number, size: number): Observable<any> {
    return this.http.get<{ users: User[], page: number, size: number, totalPages: number }>(
      `${environment.backendServerPORT}/all-drivers?page=${page}&size=${size}`
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
    return this.http.get<User[]>(`${environment.backendServerPORT}/driver/specific-driver`, { params });
  }
    updateUser(userData) {
      return this.http.patch<any>(`${environment.backendServerPORT}/driver/update-driver`, userData,{observe:'response'})
    } 
    deleteUser(id:string) {
      return this.http.delete(`${environment.backendServerPORT}/driver/delete-driver/${id}`, )
    }
  
   updateDriverStatus(driverId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${environment.backendServerPORT}/driver/toggle-status`, { userId: driverId, status });
  }

  updateDriverServiceType(driverId: string, serviceType: string): Observable<any> {
    return this.http.patch<any>(`${environment.backendServerPORT}/driver/update-service-type`, { userId: driverId, serviceType });
  }
  //post request to assing driver
  assingDriverToRide(assignedDriver): Observable<HttpResponse<any[]>>{
    return this.http.post<any[]>(`${environment.backendServerPORT}/driver-assigned`, assignedDriver, {observe:'response'})
  }
     getAllDriverStatus(): Observable<any> {
    return this.http.get<any[]>(
      `${environment.backendServerPORT}/all-drivers/status`, {observe:'response'}
    );
  }
  //---post driver assinged to vehicle
  assignDriverToVehicle(payload): Observable<HttpResponse<any[]>>{
    return this.http.post<any[]>(`${environment.backendServerPORT}/assign/vehicle`, payload, {observe:'response'} )
  }
  getDriver(id): Observable<HttpResponse<any>>{
    return this.http.get(`${environment.backendServerPORT}/get/driverObject/${id}`, {observe:'response'})
  }
  getDrivers(): Observable<HttpResponse<any>>{
    return this.http.get(`${environment.backendServerPORT}/get/drivers`, {observe:'response'})
  }
}
