import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryApiService {

  constructor(private http: HttpClient) { }


  onGetHttpCall() {
    this.http.get('https://restcountries.com/v3.1/all')
    // .subscribe((result) => {
    //  console.log("Currency: ", result[136].currencies.INR);
    //    console.log("Calling code:", result[136].idd.root + result[136].idd.suffixes[0]);
    //     console.log("Calling code:", result[136].idd.root + result[136].idd.suffixes[0]);
    //  console.log("Flag: " ,result[136].flags.svg);
    //   //  console.log("TimeZone: " ,result[136].timezone);
     
     
       
    //  })
  }
}
