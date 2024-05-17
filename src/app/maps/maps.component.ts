import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../services/maps/mapsApi.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef') mapElement: ElementRef;
  searchText: string = '';
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];
  address: string = '';
  userGeolocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  selectedLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  isUserLocation: boolean = true; // State variable to track the mode

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.getUserLocation();
  }

  ngAfterViewInit() {
    this.mapService.googleMapsApi(this.mapElement.nativeElement, this.userGeolocation);
  }

  getUserLocation() {
    this.mapService.getLocationService().then(response => {
      this.userGeolocation.lat = response.lat;
      this.userGeolocation.lng = response.lng;
      if (this.isUserLocation) {
        this.mapService.googleMapsApi(this.mapElement.nativeElement, this.userGeolocation);
      }
    }).catch(error => {
      console.error('Error getting user location:', error);
    });
  }

  onSearchChange(search: string) {
    if (search === '') {
      return this.suggestions = [];
    }
    this.searchText = search;
    this.mapService.getPlacePredictions(this.searchText).then(results => {
      this.suggestions = results;
    }).catch(error => {
      console.error('Error searching places:', error);
      this.suggestions = [];
    });
  }

  onClickOutside() {
    return this.suggestions = [];
  }

  onSelectAddress(suggestion: google.maps.places.AutocompletePrediction, id: string) {
    this.address = suggestion.structured_formatting.main_text;
    this.geocode(this.address, id);
  }

  geocode(address: string, id: string) {
    this.mapService.geocodeAddress(address).then((results: google.maps.GeocoderResult[]) => {
      const location = results[0].geometry.location;
      if (location) {
        this.selectedLocation = { lat: location.lat(), lng: location.lng() };
        this.isUserLocation = false; // Switching to searched location
        this.mapService.googleMapsApi(this.mapElement.nativeElement, this.selectedLocation);
      }
    }).catch(error => {
      console.error('Geocoding error:', error);
    });
  }

  switchToUserLocation() {
    this.isUserLocation = true; // Switching to user location
    this.mapService.googleMapsApi(this.mapElement.nativeElement, this.userGeolocation);
  }
}
