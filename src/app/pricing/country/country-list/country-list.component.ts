import { Component, OnInit } from '@angular/core';
import { CountryApiService } from '../../../services/countryApi.service.ts/country-api.service';
import { Country } from '../../../shared/country';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
})
export class CountryListComponent implements OnInit {
countryDetails: Country[]=[]

  constructor(private countryApiService: CountryApiService) { 
   
  }
  ngOnInit(): void {
    // this.countryDetails = this.countryApiService.country
    // console.log("country-list component: ", this.countryDetails);
    
  }

}
