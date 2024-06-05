// src/app/country-list/country-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CountryApiService } from '../../../services/countryApi.service.ts/country-api.service';


@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  countries: any[] = [];

  constructor(private countryApiService: CountryApiService) { }

  ngOnInit(): void {
    this.countryApiService.getAllCountries().subscribe((data: any[]) => {
      this.countries = data;
    }, error => {
      console.error('Error fetching countries:', error);
    });
  }
}
