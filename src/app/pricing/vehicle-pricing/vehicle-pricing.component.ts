import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { Country } from '../../shared/country';
import { CityService } from '../../services/city/city.service';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../shared/vehicle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import { Pricing } from '../../shared/pricing';
import { VehiclePricingService } from '../../services/pricing/vehicle-pricing.service';

@Component({
  selector: 'app-vehicle-pricing',
  templateUrl: './vehicle-pricing.component.html',
  styleUrls: ['./vehicle-pricing.component.css']
})
export class VehiclePricingComponent implements OnInit {
  pricingForm: FormGroup;
  countries: Country[] = [];
  cityArray = [];
  filteredCityArray = []; // Array to hold filtered cities
  selectedCountryId: string | null = null;
  selectedCityId: string | null = null; // To store the selected city's ID
  vehicleTypes: Vehicle[] = []; // To store the available vehicle types
  vehicleTypeArray: any[] = []
  vehiclesArray: any = []
  vehicleId: string = ''; 
  maxCapacity: number = null;
  pricingObject: Pricing;
  countryObjectId: string = '';
  newPricing:boolean = false
  // @ViewChild('selectCountry') selectCountry: ElementRef;
  @ViewChild('selectCountryOption') selectCountryOption:ElementRef
  pricingControls = [
    { name: 'driverProfit', label: 'Driver Profit', placeholder: 'Driver Profit' },
    { name: 'minFare', label: 'Min. Fare', placeholder: 'Min. Fare' },
    { name: 'distanceForBasePrice', label: 'Distance For Base Price', placeholder: 'Distance For Base Price' },
    { name: 'basePrice', label: 'Base Price', placeholder: 'Base Price' },
    { name: 'pricePerUnitDistance', label: 'Price Per Unit Distance', placeholder: 'Price Per Unit Distance' },
    { name: 'pricePerUnitTime', label: 'Price Per Unit Time(min)', placeholder: 'Price Per Unit Time(min)' },
    { name: 'maxSpace', label: 'Max Space', placeholder: 'Max Space' },
  ];


  constructor(
    private countryApiService: CountryApiService,
    private cityService: CityService,
    private cd: ChangeDetectorRef,
    private vehicleTypeService: VehicleTypeService,
    private fb: FormBuilder,
    private vehiclePricingService: VehiclePricingService
  ) {}

  ngOnInit(): void {
    this.getCountries();

    this.pricingForm = this.fb.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      vehicleType: ['', Validators.required],
      driverProfit: [{value: 80, disabled:true}, [Validators.required, Validators.min(0)]],
      minFare: [{value: 25, disabled:true}, [Validators.required, Validators.min(0)]],
      distanceForBasePrice: [{value: 1, disabled:false}, [Validators.required, Validators.min(0)]],
      basePrice: [{value: 20, disabled:true}, [Validators.required, Validators.min(0)]],
      pricePerUnitDistance: [{value: 10, disabled:true}, [Validators.required, Validators.min(0)]],
      pricePerUnitTime: [{value: 1, disabled:true}, [Validators.required, Validators.min(0)]],
      maxSpace: [{value:this.maxCapacity|| 0, disabled:false}, [Validators.required, Validators.min(0)]],
    });
    
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
    console.log(selectedOption.id);
    
    this.selectedCountryId = selectedOption.value;
    this.countryObjectId = selectedOption.id
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
    this.vehicleTypeService.onGetVehicle().subscribe((vehicles:any) => {
      console.log(vehicles)
      if (vehicles.vehicles.length !== 0) {
        this.vehiclesArray = vehicles.vehicles
      }
    })
    // this.getVehicleData() 
    this.cd.detectChanges();  
    // console.log(this.vehicleTypeArray)
    
  }
  
  //   getVehicleData() {
  //   this.vehicleTypeService.onGetVehicle().subscribe(
  //     (response: any) => {
  //       // console.log(response.vehicles);
  //       this.vehicleTypeService.vehicleDataArray = response.vehicles
  //       console.log(response.vehicles);
        
  //       const vehicleType  = []
        
  //       for (const vehicle of response.vehicles) {

  //         vehicleType.push(vehicle.vehicleType)
  //       }
        
  //       this.vehicleTypeArray = [...new Set(vehicleType)]
  //       console.log(this.vehicleTypeArray);
        
  //     },
  //     (error: any) => {
  //       console.error('Error fetching vehicles:', error);
  //     }
  //   );
  // }

   onSubmit() {
     if (this.pricingForm.valid) {
      this.pricingForm.enable()
       this.pricingObject = this.pricingForm.value
       this.pricingObject.country = this.countryObjectId
      
      console.log('Form Submitted!', this.pricingObject);
       this.vehiclePricingService.postPricingData(this.pricingObject).subscribe((pricingResponse) => {
         console.log(pricingResponse);
         if (pricingResponse.status === 200) {
          this.newPricing = true
        }
       })
       setTimeout(() => {
         this.newPricing = false;
         this.pricingForm.enable()
       }, 2000);

        //  this.selectCountry.nativeElement.enable()
         
    } else {
      console.log('Form is invalid');
     }
     this.pricingForm.disable()
  }
    
  // getSelectedVehicleType(event: Event) {
  //   const vehicleType = (event.target as HTMLSelectElement).value;
  //   this.vehicleId = vehicleType;
  //     console.log(this.vehicleId);
    //   if ((this.vehicleId) === 'HatchBack') {
    //     this.maxCapacity = 3;
    //     console.log("inside hatchback");
    //   }
    //   if (this.vehicleId === 'Sedan') {
    //     this.maxCapacity = 4;
    //     console.log("inside sedan");
    //   }
    //   if (this.vehicleId === 'Electric') {
    //     this.maxCapacity = 4;
    //     console.log("inside Electric Car");
    //   }
    //   if (this.vehicleId === 'Rikshaw') {
    //     this.maxCapacity = 3;
    //     console.log("inside Rikshaw");
        
    // }
    //    if (this.vehicleId === 'SUV') {
    //     this.maxCapacity = 6;
    //     console.log("inside SUV");
        
    //   }
    //   // Update the maxSpace form control value and enable it
    // this.pricingForm.get('maxSpace').setValue(this.maxCapacity);
      // this.pricingForm.get('maxSpace').disable();
    
  // }
  }

