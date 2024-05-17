import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  userGeolocation: { lat: number, lng: number };

  private autocompleteService: google.maps.places.AutocompleteService;
  private geocoder: google.maps.Geocoder;
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
      libraries: ['places']
    });
    
    this.initAutocompleteService();
    this.initGeocoder();
  }

  private initAutocompleteService() {
    this.loader.load().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });
  }

  private initGeocoder() {
    this.loader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(response => {
        this.userGeolocation = { lat: response.coords.latitude, lng: response.coords.longitude };
        resolve(this.userGeolocation);
      }, error => {
        reject("Error getting geolocation: " + error.message);
      });
    });
  } 

  googleMapsApi(mapElement: HTMLElement, location: { lat: number, lng: number }) {
    this.loader.load().then(() => {
      this.initializeMap(mapElement, location);
    }).catch((err) => {
      console.error('Error loading Google Maps API:', err);
    });
  }

  initializeMap(mapElement: HTMLElement, location: { lat: number, lng: number }) {
    const map = new google.maps.Map(mapElement, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 18
    });

    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: 'Location'
    });
  }

  getPlacePredictions(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    return new Promise((resolve, reject) => {
      if (!this.autocompleteService) {
        reject("AutocompleteService not initialized");
        return;
      }

      this.autocompleteService.getPlacePredictions({ input: input }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions);
        } else {
          reject(status);
        }
      });
    });
  }

  geocodeAddress(address: string): Promise<google.maps.GeocoderResult[]> {
    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject("Geocoder not initialized");
        return;
      }

      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }
}
