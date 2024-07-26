import { Injectable } from '@angular/core';
import { GoogleMapsLoaderService } from './google-maps-loader.service';

@Injectable({
  providedIn: 'root'
})
export class DistanceTimeService {
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;

  constructor(private googleMapsLoader: GoogleMapsLoaderService) {
    this.googleMapsLoader.load().then(() => {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
    }).catch((err) => {
      console.error('Error loading Google Maps API:', err);
    });
  }

  getDirections(from: { lat: number, lng: number }, to: { lat: number, lng: number }): Promise<google.maps.DirectionsResult> {
    return new Promise((resolve, reject) => {
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(from.lat, from.lng),
        destination: new google.maps.LatLng(to.lat, to.lng),
        travelMode: google.maps.TravelMode.DRIVING // Default travel mode
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve(result);
        } else {
          reject(status);
        }
      });
    });
  }

  renderDirections(map: google.maps.Map, result: google.maps.DirectionsResult) {
    this.directionsRenderer.setMap(map);
    this.directionsRenderer.setDirections(result);
  }
}
