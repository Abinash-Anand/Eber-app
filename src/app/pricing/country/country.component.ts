import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { MapService } from '../../services/maps/mapsApi.service';
import { LowerCasePipe } from '@angular/common';
import { Country } from '../../shared/country';
// import { CountryApiService } from '../../services/countryApi.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit{
  countryForm: FormGroup;
  countries: any[] = [];
  errorMessage: string = '';
  searchCountryNotFound:string=''
  duplicateCountry: boolean = false
  countryAdded: boolean = false
  @ViewChild('searchCountry') searchCountryEl: ElementRef;
  @ViewChild('searchCountry') searchCountry: ElementRef
  @ViewChild('formSearch') formSearch: NgForm
  searchedCountry: Country[] = []
  searchAlert: boolean =  false;
  constructor(private fb: FormBuilder, private countryApiService: CountryApiService,
    private autoSuggestCountry: MapService 
  ) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      'callingCode': ['', Validators.required ],
      'countryCode': ['', Validators.required],
    });

    this.countryForm.get('name')?.valueChanges.subscribe(value => {
      this.onCountryNameChange(value);

    });

  }
  ngOnInit(): void {
  this.getCountriesData()
    
  }
  
  //===============================Get all countries request=====================================
  getCountriesData() {
    this.countryApiService.getAllCountries().subscribe((response) => {
      // console.log(response);
      for (let country of response) {
        this.countries.push(country)
      }
      
    })
  }
//=========================== Duplicate country Check feature ==============================
  duplicateCountryCheck(code) {

    const duplicateCountryObject = this.countries.find(({ countryCallingCode }) => {
      return countryCallingCode === code
      
    })
    // console.log(duplicateCountryObject);
      // console.log(`calling code ${callingCode.callingCode}, recieved code ${code}`);
    // console.log("Country Calling Code: ",duplicateCountryObject);
    if (duplicateCountryObject) {
   this.duplicateCountry = true
      return this.duplicateCountry
    }
    else {
      this.duplicateCountry = false
    }
    
  }
  
  //======================================== OnCountrynameChange ======================================
  onCountryNameChange( countryName: string) {
 
    if (countryName) {
      

      this.countryApiService.getCountryByName(countryName).subscribe(
        (country) => {
          if (country) {
            this.countryForm.patchValue({
              currency: country.currency.name,
              'callingCode': country.countryCallingCode,
              'countryCode': country.countryCode
            });
          }
        },
        (error) => {
          this.errorMessage = `Error fetching country data: ${error.message}`;
        }
      );
    }
  }
//========================= Add Country Feature ==========================================
  onAddCountry() {
   
   if (this.countryForm.valid) {
     const countryName = this.countryForm.get('name')?.value;
     const countryCode = this.countryForm.value.callingCode 
     
     this.duplicateCountryCheck(countryCode)
    
    this.countryApiService.getCountryByName(countryName).subscribe(
      (country) => {
        // console.log('Country response:', country);
        if (!this.countries.some(c => c.name === country.name)) {
          // console.log( country);
          
          const  countryObject: Country = {
            name: country.name,
            currency: country.currency.code,
            countryCallingCode: country.countryCallingCode,
            countryCode: country.countryCode,
            flag: country.flag,
            timeZone: country.timeZone,
          }

          this.countryApiService.postCountryForm(countryObject).subscribe((response) =>
          {
            // console.log('Country saved response:', response);
            const id = response.body.countryCode
            // console.log(response.body);
            setTimeout(() => {
              this.countryAdded = false
            }, 3000);
            if (response.status === 201) {
              this.countryAdded = true
              this.countries.push(response.body)
            }
            // console.log(response.status, response.statusText);
            
            },
            (error) => {
              console.error('Error saving country:', error);  // Log any errors
              this.errorMessage = 'Error saving country.';
            }
            
          );
        } else {
          this.errorMessage = 'Country already exists.';
        }
      },
      (error) => {
        console.error('Error fetching country data:', error);  // Log any errors
        this.errorMessage = `Error fetching country data: ${error.message}`;
      }
    );
  }
  this.countryForm.reset();
  }
  

//===================================================================================
  //get single country data
  // getSingleCountryData(id) {
  //   this.countryApiService.getSingleCounty(id).subscribe((singleCountry) => {
  //     console.log(singleCountry);
  //     // this.countries.push(singleCountry);
      
  //   })
  // }


  //================================= Search Bar to search Country based on name ==================
  onSearchCountry() {
    
    console.log(this.formSearch);
    const searchName = this.formSearch.value.search
    this.searchCountryNotFound = searchName
     this.searchedCountry = this.countries.filter((country) =>
       (country.name).toLowerCase() === searchName.toLowerCase())
      
    if (this.searchedCountry.length < 1 ) {
      this.searchAlert = true

       setTimeout(() => {
              this.searchAlert = false
            }, 3000);
    } 
    console.log(this.searchedCountry);
    
    
    
  }

 
}
