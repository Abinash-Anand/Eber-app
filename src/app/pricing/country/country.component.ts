import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { MapService } from '../../services/maps/mapsApi.service';
// import { CountryApiService } from '../../services/countryApi.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent {
  countryForm: FormGroup;
  countries: any[] = [];
  errorMessage: string = '';
  duplicateCountry: boolean= false
  @ViewChild('searchCountry') searchCountryEl: ElementRef;

  constructor(private fb: FormBuilder, private countryApiService: CountryApiService,
    private autoSuggestCountry: MapService
  ) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      'calling-code': ['', Validators.required ],
      'country-code': ['', Validators.required],
    });

    this.countryForm.get('name')?.valueChanges.subscribe(value => {
      this.onCountryNameChange(value);
    });
  }

  onCountryNameChange(name: string) {
  
    if (name) {
      this.countryApiService.getCountryByName(name).subscribe(
        (country) => {
          if (country) {
            this.countryForm.patchValue({
              currency: country.currency.symbol,
              'calling-code': country.countryCallingCode,
              'country-code': country.countryCode
            });
          }
        },
        (error) => {
          this.errorMessage = `Error fetching country data: ${error.message}`;
        }
      );
    }
  }

  onAddCountry() {
    
    if (this.countryForm.valid) {

      const countryName = this.countryForm.get('name')?.value;
      this.countryApiService.getCountryByName(countryName).subscribe(
        (country) => {
          if (!this.countries.some(c => c.name === country.name)) {
            this.countries.push(country);
            console.log('Country added:', country);
          } else {
            this.errorMessage = 'Country already exists.';
          }
        },
        (error) => {
          this.errorMessage = `Error fetching country data: ${error.message}`;
         
        }
      );
    }
    this.countryForm.reset()
  }
 
}
