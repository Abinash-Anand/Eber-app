import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}
