import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LowerCasePipe } from '@angular/common';
import { Country } from '../../shared/country';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CountryApiService {

  private apiUrl = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) { }

  getCountryByName(name: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/name/${name}`).pipe(
      map(countries => countries.map(country => ({
        name: country.name.common,
        currency: Object.keys(country.currencies).map(key => ({
          code: key,
          name: country.currencies[key].name,
          symbol: country.currencies[key].symbol
        }))[0],
        countryCode: country.cca2,
        countryCallingCode: `${country.idd.root}${country.idd.suffixes[0]}`,
        flag: country.flags.svg,
        timeZone: country.timezones[0]
      }))[0])  // Assuming we want the first result for simplicity
    );
  }

  //Submit form post request
  //function naming convention => prefix(method used) + middle(component name) + (implementation component)suffix
 // Submit form post request
postCountryForm(country: Country): Observable<HttpResponse<Country>> {
    return this.http.post<Country>(`${environment.backendServerPORT}/add-country`, country, {observe:'response'});
  }

  //get request to get all the countries
  getAllCountries(): Observable<any>{
    return this.http.get<Country[]>(`${environment.backendServerPORT}/get-countries`)
  }
  //get single country
  getSingleCounty(id): Observable<Country>{
  return this.http.get<Country>(`${environment.backendServerPORT}/get-country/:${id}`)
  }



  addCity(cityData: any): Observable<any> {
    return this.http.post(`${environment.backendServerPORT}/cities`, cityData);
  }
}
