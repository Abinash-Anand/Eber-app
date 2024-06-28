import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { Country } from '../../shared/country';
import { CityService } from '../../services/city/city.service';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../shared/vehicle';

@Component({
  selector: 'app-vehicle-pricing',
  templateUrl: './vehicle-pricing.component.html',
  styleUrls: ['./vehicle-pricing.component.css']
})
export class VehiclePricingComponent implements OnInit {
  countries: Country[] = [];
  cityArray = [];
  filteredCityArray = []; // Array to hold filtered cities
  selectedCountryId: string | null = null;
  selectedCityId: string | null = null; // To store the selected city's ID
  vehicleTypes: Vehicle[] = []; // To store the available vehicle types
  vehicleTypeArray: {vehicleType:string}[] = []
  constructor(
    private countryApiService: CountryApiService,
    private cityService: CityService,
    private cd: ChangeDetectorRef,
    private vehicleTypeService: VehicleTypeService
  ) {}

  ngOnInit(): void {
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
    const selectElement = (event.target as HTMLSelectElement);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.selectedCountryId = selectedOption.value;

    this.filterCitiesByCountry();
  }

  filterCitiesByCountry() {
    if (this.selectedCountryId) {
      this.filteredCityArray = this.cityArray.filter(city => city.country === this.selectedCountryId);
      this.cd.detectChanges();
    }
  }

  onCityChange(event: Event) {
    const selectElement = (event.target as HTMLSelectElement);
    this.selectedCityId = selectElement.value;

    this.getVehicleTypesByCity();
  }

  getVehicleTypesByCity() {  
    this.vehicleTypeArray = this.vehicleTypeService.vehicleTypeArray
    this.getVehicleData()
    this.cd.detectChanges();
    
  }
  
    getVehicleData() {
    this.vehicleTypeService.onGetVehicle().subscribe(
      (response: any) => {
        // console.log(response.vehicles);
        this.vehicleTypeService.vehicleDataArray = response.vehicles
        const vehicleType  = []
        
        for (const vehicle of response.vehicles) {

          vehicleType.push(vehicle.vehicleType)
        }
        
        this.vehicleTypeArray = [...new Set(vehicleType)]
        console.log(this.vehicleTypeArray);
      },
      (error: any) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }
  }

