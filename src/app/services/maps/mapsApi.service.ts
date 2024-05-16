  import { ElementRef, Injectable } from '@angular/core';
  import { Loader } from '@googlemaps/js-api-loader';
  import { environment } from '../../../environment';

  @Injectable({
    providedIn: 'root'
  })
  export class MapService {

    
    constructor() { }

    googleMapsApi(mapElement) {
      const loader = new Loader({
        apiKey: environment.googleMapsApiKey,
        version: "weekly", // Change this to the version you need
        libraries: ["places"] // Add any additional libraries you need
      });

      loader.load().then(() => {
        // Google Maps API loaded successfully
        this.initializeMap(mapElement);
      }).catch((err) => {
        console.error('Error loading Google Maps API:', err);
      });
    }

    initializeMap(mapElement: HTMLElement) {
      // Initialize your map here
      const map = new google.maps.Map(mapElement, {
        center: { lat: 18.5204, lng: 73.8567 },
        zoom: 12
      });
    }


  }
