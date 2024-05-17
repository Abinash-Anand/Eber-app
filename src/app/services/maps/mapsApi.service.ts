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

  googleMapsApi(mapElement: HTMLElement, location: { lat: number, lng: number }, onMarkerDragEnd: (location: { lat: number, lng: number }) => void) {
    this.loader.load().then(() => {
      this.initializeMap(mapElement, location, onMarkerDragEnd);
    }).catch((err) => {
      console.error('Error loading Google Maps API:', err);
    });
  }

  initializeMap(mapElement: HTMLElement, location: { lat: number, lng: number }, onMarkerDragEnd: (location: { lat: number, lng: number }) => void) {
    const map = new google.maps.Map(mapElement, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 18
    });

    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      draggable: true, // Make the marker draggable
      title: 'Location'
    });

    // Listen for dragend event on the marker
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        const newLocation = { lat: position.lat(), lng: position.lng() };
        onMarkerDragEnd(newLocation); // Call the provided callback with new location
      }
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

  reverseGeocode(location: { lat: number, lng: number }): Promise<google.maps.GeocoderResult[]> {
    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject("Geocoder not initialized");
        return;
      }

      this.geocoder.geocode({ location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }
}
