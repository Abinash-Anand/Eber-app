import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { Country } from '../../shared/country';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../services/maps/mapsApi.service';
import { ZonesService } from '../../services/maps/zones.service';
import { Coordinateslatlng } from '../../shared/coordinateslatlng';
import { Zone } from 'zone.js/lib/zone-impl';
import { CityService } from '../../services/city/city.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
})
export class CityComponent implements AfterViewInit {
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
  allCitiesList:Zone[]  = []
  map: google.maps.Map;
  activeInput: 'from' | 'to' | 'search' = 'from';
  activeClass: boolean = false;
  totalDistance: string = '';
  EstimatedTime: string = '';
  @ViewChild('mapRef') mapElement: ElementRef;
  countryId:string ;
  selectedCountryId: string | null = null;
  selectedCountryCode: string = '';
  zoneCheck: string = '';
  zoneObject: {
    id: string, city: string, latLngCoords:string}= { id: '',city: '',latLngCoords:''};
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
  }

  getCountries() {
    this.countryApiService.getAllCountries().subscribe(countries => {
      this.countries = countries;
        this.cd.detectChanges();
      
      
    });
  }

  onCountryChange(event: Event) {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
    const selectElement = (event.target as HTMLSelectElement);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.selectedCountryId = selectedOption.getAttribute('data-country-id');
    // console.log(this.selectedCountryId);
    
    
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

      // console.log("City Name: ", place.name);
      //checking if the city is present in the database
      this.cityService.getCitiesData().subscribe((zone) => {
        console.log(zone.body[0].city);
        this.zoneCheck = zone.body[0].city
        
      })
      if (place.name === this.zoneCheck) {
        const zoneSelected = this.zoneCheck
        this.mapService.geocodeAddress(zoneSelected).then((result) => {
          console.log(result);
        })
      } else {
        
      }

      const zoneSelected = place.name;
      this.mapService.geocodeAddress(zoneSelected).then((result) =>
      {
        const coordinateIndex =  Number(Object.keys(result));
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
        // console.log(this.zoneCoordinates);
        
        this.zonesService.zoneCoordinates = this.zoneCoordinates; // Ensure coordinates are set
        this.mapService.googleMapsApi(this.mapElement.nativeElement, this.searchLocation, this.onMarkerDragEnd.bind(this));
        this.zonesService.polygonCoordinatesChanged.subscribe((updatedCoords: google.maps.LatLngLiteral[]) => {
        const coordsStringify = JSON.stringify(updatedCoords)
          this.zoneObject = {
            id: this.selectedCountryId,
            city: zoneSelected,
            latLngCoords:coordsStringify
          }
          console.log(this.zoneObject);
          //calling the post service
        
         console.log('Updated Polygon Coordinates:', coordsStringify);
  // Perform further operations with the updated coordinates
});

      });
    });
  }

  onAddCity() {
    if (this.cityForm.valid) {
      const cityData = this.cityForm.value;
     this.cityService.postZoneData(this.zoneObject).subscribe((res) => {
       console.log(res);
       this.zoneObject.id = ''  
       this.zoneObject.city = ''
       this.zoneObject.latLngCoords=''
            
          })
    }
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
    this.cityService.getCitiesData().subscribe((zones) => {
      console.log(JSON.parse(zones.body[0].latLngCoords));
      this.allCitiesList = zones.body;

    })
  }
}
