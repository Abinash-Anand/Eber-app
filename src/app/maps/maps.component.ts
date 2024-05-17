import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../services/maps/mapsApi.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef') mapElement: ElementRef;
  fromAddress: string = '';
  toAddress: string = '';
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];
  userGeolocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  fromLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  toLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  map: google.maps.Map;
  google: any;
  activeInput: 'from' | 'to' = 'from';
  activeClass: boolean = false
  totalDistance: string = ''
  EstimatedTime:string = ''
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.getUserLocation();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  getUserLocation() {
    this.mapService.getLocationService().then(response => {
      this.userGeolocation = response;
      this.initializeMap();
    }).catch(error => {
      console.error('Error getting user location:', error);
    });
  }
  
  initializeMap() {
    if (this.mapElement && this.mapElement.nativeElement && this.userGeolocation.lat !== 0 && this.userGeolocation.lng !== 0) {
      this.mapService.googleMapsApi(this.mapElement.nativeElement, this.userGeolocation, this.onMarkerDragEnd.bind(this)).then(map => {
        this.map = map;
      }).catch(error => {
        console.error('Error initializing map:', error);
      });
    }
  }

  onSearchChange(search: string, type: 'from' | 'to') {
    this.activeInput = type;
    if (search === '') {
      return this.suggestions = [];
    }
    this.mapService.getPlacePredictions(search).then(results => {
      this.suggestions = results;
    }).catch(error => {
      console.error('Error getting place predictions:', error);
    });
  }

  onSuggestionClick(suggestion: google.maps.places.QueryAutocompletePrediction, type: 'from' | 'to') {
    if (type === 'from') {
      this.fromAddress = suggestion.description;
      this.mapService.geocodeAddress(this.fromAddress).then(results => {
        this.fromLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        this.mapService.addMarker(this.map, this.fromLocation, 'Start', 'red');
        if (this.fromLocation && this.toLocation) {
          this.calculateRoute();
        }
      }).catch(error => {
        console.error('Error geocoding address:', error);
      });
    } else {
      this.toAddress = suggestion.description;
      this.mapService.geocodeAddress(this.toAddress).then(results => {
        this.toLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        this.mapService.addMarker(this.map, this.toLocation, 'End', 'green');
        if (this.fromLocation && this.toLocation) {
          this.calculateRoute();
        }
      }).catch(error => {
        console.error('Error geocoding address:', error);
      });
    }
    this.suggestions = [];
  }

  onMarkerDragEnd(location: { lat: number, lng: number }) {
    this.mapService.reverseGeocode(location).then(results => {
      const address = results[0].formatted_address;
      this.fromAddress = address;
      this.fromLocation = location;
    }).catch(error => {
      console.error('Error reverse geocoding:', error);
    });
  }

  calculateRoute() {
    this.mapService.getDirections(this.fromLocation, this.toLocation).then(result => {
      this.mapService.renderDirections(this.map, result);
      const route = result.routes[0];
      if (route) {
        const leg = route.legs[0];
        this.EstimatedTime = leg.duration.text
        this.totalDistance = leg.distance.text
        console.log(`Distance: ${leg.distance.text}, Duration: ${leg.duration.text}`);
      }
    }).catch(error => {
      console.error('Directions error:', error);
    });
  }

  onSelectDirection() {
    this.activeClass = !this.activeClass
  }

}
