import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { Country } from '../../shared/country';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MapService } from '../../services/maps/mapsApi.service';
import { ZonesService } from '../../services/maps/zones.service';
import { Coordinateslatlng } from '../../shared/coordinateslatlng';
import { Zone } from '../../shared/zone';
import { CityService } from '../../services/city/city.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
})
export class CityComponent implements AfterViewInit, OnDestroy {
  selectedCity: any;
  cityForm: FormGroup;
  countries: Country[] = [];
  selectedCountry: string = '';
  searchLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  searchAddress: string = '';
  fromAddress: string = '';
  toAddress: string = '';
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];
  userGeolocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  fromLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  toLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  zoneCoordinates: Coordinateslatlng = { southLat: 0.0, southLng: 0.0, northLat: 0.0, northLng: 0.0 };
  allCitiesList: Zone[] = [];
  map: google.maps.Map;
  activeInput: 'from' | 'to' | 'search' = 'from';
  activeClass: boolean = false;
  totalDistance: string = '';
  EstimatedTime: string = '';
  @ViewChild('mapRef') mapElement: ElementRef;
  countryId: string;
  selectedCountryId: string | null = null;
  selectedCountryCode: string = '';
  zoneCheck: string = '';
  zoneObject: {
    id: string,
    country: string,
    city: string,
    latLngCoords: string 
  } = { id: '', country: '', city: '', latLngCoords: '' };
  toggleZoneComponent: boolean = false;
  successMsg: boolean = false;
  cityList: any = [];
  @ViewChild('zoneUpdateForm') zoneUpdateForm:NgForm
  private subscriptions: Subscription[] = []; // Track subscriptions
  @ViewChild('cityChange') cityChange: ElementRef
    updatedPolygonCoords: google.maps.LatLngLiteral[] = []; // Store updated polygon coordinates
   
Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
  });
  constructor(
    private fb: FormBuilder,
    private countryApiService: CountryApiService,
    private mapService: MapService,
    private cd: ChangeDetectorRef,
    private zonesService: ZonesService,
    private cityService: CityService
  ) {
    this.cityForm = this.fb.group({
      country: [{ value: '', disabled: false }, Validators.required],
      zone: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.getCountries();
     this.zonesService.polygonCoordinatesChanged.subscribe((updatedCoords: google.maps.LatLngLiteral[]) => {
      console.log("Captured updated coordinates in CityComponent: ", updatedCoords);
      this.updatedPolygonCoords = updatedCoords; // Store the updated polygon coordinates
      this.updateZoneObject(); // Optionally update zone object with new coordinates
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  getCountries() {
    const countriesSub = this.countryApiService.getAllCountries().subscribe(countries => {
      this.countries = countries;
      this.cd.detectChanges();
    });
    this.subscriptions.push(countriesSub);
  }

  onCountryChange(event: Event) {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
    const selectElement = (event.target as HTMLSelectElement);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.selectedCountryId = selectedOption.getAttribute('data-country-id');
    this.cityForm.get('country')?.disable();
  }

  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('zoneInput') as HTMLInputElement, {
      types: ['(cities)'],
      componentRestrictions: { country: this.selectedCountry }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log(place);

      this.cityForm.patchValue({ zone: place.name });
      if (place.name === this.zoneCheck) {
        const zoneSelected = this.zoneCheck;
        console.log("City List ", this.cityService.getCitiesData);
        return;
      }

      const cityDataSub = this.cityService.getCitiesData().subscribe((zone) => {
        console.log(zone.body[1].city);
        this.zoneCheck = zone.body[1].city;
      });
      this.subscriptions.push(cityDataSub);

      const zoneSelected = place.name;

      this.mapService.geocodeAddress(zoneSelected).then((result) => {
        const coordinateIndex = Number(Object.keys(result));
        this.searchLocation = { lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() };
        const viewportObjectNorth = result[coordinateIndex].geometry.viewport.getNorthEast();
        const viewportObjectSouth = result[coordinateIndex].geometry.viewport.getSouthWest();
        this.zonesService.location = this.searchLocation;

        this.zoneCoordinates = {
          northLat: viewportObjectNorth.lat(),
          northLng: viewportObjectNorth.lng(),
          southLat: viewportObjectSouth.lat(),  
          southLng: viewportObjectSouth.lng()       
        };

        this.zonesService.zoneCoordinates = this.zoneCoordinates; // Ensure coordinates are set
        this.mapService.googleMapsApi(this.mapElement.nativeElement, this.searchLocation, this.onMarkerDragEnd.bind(this));
    
        this.handlePolygonCoordinatesChange(zoneSelected)
      });
    });
  }

  handlePolygonCoordinatesChange(zoneSelected: string) {
  console.log("ZONE SELECTED: ", zoneSelected)
  this.zonesService.polygonCoordinatesChanged.subscribe((updatedCoords: google.maps.LatLngLiteral[]) => {
    const coordsStringify = JSON.stringify(updatedCoords);
    this.zoneObject = {
      id: this.selectedCountryId,
      country: this.selectedCountry,
      city: zoneSelected,
      latLngCoords: coordsStringify
    };
    console.log(this.zoneObject);
    console.log('Updated Polygon Coordinates:', coordsStringify);

    // You can also update the zone data by calling the update function here if needed
    // this.updateZoneData(this.zoneObject);
  });
}



  onAddCity() {
    if (this.cityForm.valid) {
      const cityData = this.cityForm.value;
      const postZoneDataSub = this.cityService.postZoneData(this.zoneObject).subscribe((res) => {
        console.log(res);
        this.zoneObject.id = '';
        this.selectedCountry = '';
        this.zoneObject.city =
        this.zoneObject.latLngCoords = '';
      });
      this.subscriptions.push(postZoneDataSub);

      this.successMsg = true;
      setTimeout(() => {
        this.successMsg = false;
      }, 2000);

      // Reset form and reinitialize data
      this.resetForm();
    }
  }

   // Update zone object with the updated polygon coordinates
  updateZoneObject() {
    if (this.selectedCity) {
      this.zoneObject = {
        id: this.selectedCountryId,
        country: this.selectedCountry,
        city: this.selectedCity.city,
        latLngCoords: JSON.stringify(this.updatedPolygonCoords)
      };
      console.log("UpdatedZoneObject: ", this.zoneObject);
    }
  }

 


  resetForm() {
    this.cityForm.reset();
    this.cityForm.get('country')?.enable();
    this.zoneObject = { id: '', country: '', city: '', latLngCoords: '' };
    this.selectedCountry = '';
    this.selectedCountryId = null;
    this.zoneCheck = '';
    this.unsubscribeAll();
    this.getCountries();
    // Call any other initialization methods if needed
  }

  unsubscribeAll() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
  

  onMarkerDragEnd(location: { lat: number, lng: number }) {
    if (typeof window !== 'undefined') {
      this.mapService.reverseGeocode(location).then(results => {
        const address = results[0].formatted_address;
        this.fromAddress = address;
        this.fromLocation = location;
      }).catch(error => {
        console.error('Error reverse geocoding:', error);
      });
    }
  }

  onGetZones() {
    const zonesSub = this.cityService.getCitiesData().subscribe((zones) => {
      this.allCitiesList = zones.body;
      console.log(this.allCitiesList);
    });
    this.subscriptions.push(zonesSub);
  }

   onUpdateCountryChange(event: Event) {
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
onSelectCity(city: Zone | null) {
  if (city) {
    // Parse the latLngCoords JSON string
    const coords: { lat: number, lng: number }[] = JSON.parse(city.latLngCoords);
    
    console.log("Parsed Coordinates: ", coords);

    // Ensure you use the map element from @ViewChild('mapRef')
    if (this.mapElement && this.mapElement.nativeElement) {
      this.mapService.googleMapsApi(this.mapElement.nativeElement, { lat: coords[0].lat, lng: coords[0].lng }, () => {})
        .then(map => {
          // Add the polygon to the map after initializing it
       this.mapService.addPolygon(map, coords);
          
        })
        .catch(error => {
          console.error("Error loading Google Maps: ", error);
        });
    } else {
      console.error("Map element is not available.");
    }
  } else {
    console.error("City object is null.");
  }
}


  onUpdateData() { 
    // console.log("Update Zone: ", this.zoneUpdateForm.value)
    const updatedZone = this.zoneUpdateForm.value
    updatedZone.city = this.zoneObject
    updatedZone.cityId = this.selectedCity._id
    console.log("new Zone Obj: ", updatedZone)
    this.cityService.updateZoneData(updatedZone).subscribe((response) => {
      console.log(response.body.city)
      if (response.status === 200) {
        // this.selectedCity(response.body.city);
          Swal.fire({
        title: 'Success!',
        text: 'Zone Area Update Successful.',
        icon: 'success',
        confirmButtonText: 'OK'
});
      } else {
        this.Toast.fire({
             icon: 'error',  
          title: 'Something went wrong.'
            })
      } 

    })
  }
  
onUpdateCityChange(event: Event) {
  console.log("Selected City: ", this.selectedCity);
  
  if (this.selectedCity) {
    console.log("this.selectCity: ", this.selectedCity)
    // Call onSelectCity with the selected city to display the map
    this.onSelectCity(this.selectedCity);
  } else {
    console.error("City selection failed or no city selected.");
  }
}


}
