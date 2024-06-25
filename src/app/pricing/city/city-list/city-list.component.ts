import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { CityService } from '../../../services/city/city.service';
import { Zone } from '../../../shared/zone';
import { Country } from '../../../shared/country';
import { FormBuilder } from '@angular/forms';
import { CountryApiService } from '../../../services/countryApi.service.ts/country-api.service';
import { MapService } from '../../../services/maps/mapsApi.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'] // Corrected the styleUrls property
})
export class CityListComponent implements AfterViewInit {
  allCitiesList: Zone[] = [];
  countries: Country[] = [];
  cityList: Zone[] = []; // Initialize as an array
  selectedCountry: string = '';
  selectedCountryId: string | null = null;
  selectedCity: Zone | null = null; // Add a property to store the selected city
  cityArray: Zone[] = [];

  constructor(
    private cityService: CityService,
    private fb: FormBuilder,
    private countryApiService: CountryApiService,
    private mapService: MapService, // Inject MapService
    private cd: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.getCountries();
  }

  getCountries() {
    this.countryApiService.getAllCountries().subscribe(countries => {
      this.countries = countries;
      this.cityService.getCitiesData().subscribe(city => {
        this.cityArray = city.body;

        // Filter countries based on cityArray
        const filteredCountries = this.countries.filter(country => 
          this.cityArray.some(city => city.country === country.countryCode)
        );

        // Remove duplicates
        this.countries = filteredCountries.filter((country, index, self) => 
          index === self.findIndex((c) => c.countryCode === country.countryCode)
        );

        console.log("Filtered Countries: ", this.countries);

        this.cd.detectChanges();
      });
    });
  }

  onCountryChange(event: Event) {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
    const selectElement = (event.target as HTMLSelectElement);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.selectedCountryId = selectedOption.getAttribute('data-country-id');
    // console.log(this.selectedCountryId);

    if (this.selectedCountryId) {
      this.getCityListByCountry(this.selectedCountryId);
    }
  }

  getCityListByCountry(countryId: string) {
    this.cityService.getCitiesByCountry(countryId).subscribe(cityList => {
      this.cityList = cityList; // Assuming cityList.body contains the list of cities
      console.log("Selected City :",this.cityList);
      this.cd.detectChanges();
    });
  }

  onCityChange(event: Event) {
    const selectElement = (event.target as HTMLSelectElement);
    const selectedCity = selectElement.options[selectElement.selectedIndex].value;
    this.selectedCity = this.cityList.find(city => city.city === selectedCity) || null;
    console.log(this.selectedCity); // Log the selected city object
  }
  
  onSelectCity(city: Zone | null) {
    if (city) {
      // Parse the latLngCoords JSON string
      const coords: { lat: number, lng: number }[] = JSON.parse(city.latLngCoords);
      
      console.log(coords);
      // Assuming you have a mapElement in your template to pass to googleMapsApi
      this.mapService.googleMapsApi(document.getElementById('map'), { lat: coords[0].lat, lng: coords[0].lng }, () => {}).then(map => {
        // Add the polygon to the map
        this.mapService.addPolygon(map, coords);
      });
    }
  }
}
