import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { Country } from '../../shared/country';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../services/maps/mapsApi.service';
import { ZonesService } from '../../services/maps/zones.service';
import { Coordinateslatlng } from '../../shared/coordinateslatlng';
import { Zone } from '../../shared/zone';
import { CityService } from '../../services/city/city.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
})
export class CityComponent implements AfterViewInit, OnDestroy {
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

  private subscriptions: Subscription[] = []; // Track subscriptions

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
        });
      });
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
}

