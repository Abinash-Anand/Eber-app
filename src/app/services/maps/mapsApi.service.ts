import { ElementRef, Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  userGeolocation: { lat: number, lng: number };

  constructor() { }

  
  //===========================Geolocation api Service=============================
  getLocationService(): Promise<any>{
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(response => {
        this.userGeolocation = { lat: response.coords.latitude, lng: response.coords.longitude };
        resolve(this.userGeolocation);
      }, error => {
        reject("Error getting geolocation: " + error.message);
      });
    });
  } 
  //=================================MAP Service===================================================
  googleMapsApi(mapElement) {
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: "weekly", // Change this to the version you need
      libraries: ["places",] // Add any additional libraries you need
    });

    loader.load().then(() => {
      // Google Maps API loaded successfully
      this.initializeMap(mapElement, this.userGeolocation);
    }).catch((err) => {
      console.error('Error loading Google Maps API:', err);
    });
  }

  initializeMap(mapElement: HTMLElement, userGeolocation: { lat: number, lng: number }) {
    // Initialize your map here
    const map = new google.maps.Map(mapElement, {
      center: { lat: userGeolocation.lat, lng: userGeolocation.lng },
      zoom: 18
    });

    // Add marker for user's location
    const userMarker = new google.maps.Marker({
      position: { lat: userGeolocation.lat, lng: userGeolocation.lng },
      map: map,
      title: 'Your Location'
    });
  }
}
