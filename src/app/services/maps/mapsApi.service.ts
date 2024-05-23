import { Injectable } from '@angular/core';
import { DistanceTimeService } from './distancetime.service';
import { GoogleMapsLoaderService } from './google-maps-loader.service';
import { ZonesService } from './zones.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  userGeolocation: { lat: number, lng: number };

  private autocompleteService: google.maps.places.AutocompleteService;
  private geocoder: google.maps.Geocoder;

  constructor(
    private distanceTimeService: DistanceTimeService, 
    private googleMapsLoaderService: GoogleMapsLoaderService,
        private zonesService: ZonesService

  ) {
    this.initAutocompleteService();
    this.initGeocoder();
  }

  private initAutocompleteService() {
    this.googleMapsLoaderService.load().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });
  }

  private initGeocoder() {
    this.googleMapsLoaderService.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

 getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            reject("Error getting geolocation: " + error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    });
  }

  googleMapsApi(mapElement: HTMLElement, location: { lat: number, lng: number },
    onMarkerDragEnd: (location: { lat: number, lng: number }) => void): Promise<google.maps.Map> {
    return this.googleMapsLoaderService.load().then(() => {
      const map = this.initializeMap(mapElement, location, onMarkerDragEnd);
      this.zonesService.createZone(map)
      return map;
    }).catch((err) => {
      console.error('Error loading Google Maps API:', err);
      throw err;
    });
  }

  initializeMap(mapElement: HTMLElement, location: { lat: number, lng: number },
    onMarkerDragEnd: (location: { lat: number, lng: number }) => void): google.maps.Map {
    const map = new google.maps.Map(mapElement, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 12
    });

    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      draggable: true,
      title: 'Current Location'
    });

    google.maps.event.addListener(marker, 'dragend', (event: google.maps.KmlMouseEvent) => {
      onMarkerDragEnd({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    });

    return map;
  }

  getPlacePredictions(search: string): Promise<google.maps.places.QueryAutocompletePrediction[]> {
    return new Promise((resolve, reject) => {
      this.autocompleteService.getQueryPredictions({ input: search }, (predictions, status) => {
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
      this.geocoder.geocode({ location: location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }

  addMarker(map: google.maps.Map, location: { lat: number, lng: number }, title: string, color: string): google.maps.Marker {
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: title,
      icon: {
        url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
      }
    });
    return marker;
  }

  getDirections(fromLocation: { lat: number, lng: number }, toLocation: { lat: number, lng: number }): Promise<google.maps.DirectionsResult> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route({
        origin: new google.maps.LatLng(fromLocation.lat, fromLocation.lng),
        destination: new google.maps.LatLng(toLocation.lat, toLocation.lng),
        travelMode: google.maps.TravelMode.DRIVING // Default travel mode
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve(result);
        } else {
          reject(status);
        }
      });
    });
  }

  renderDirections(map: google.maps.Map, directions: google.maps.DirectionsResult) {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(directions);
  }
}
