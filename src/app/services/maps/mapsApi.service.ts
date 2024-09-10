import { Injectable } from '@angular/core';
import { DistanceTimeService } from './distancetime.service';
import { GoogleMapsLoaderService } from './google-maps-loader.service';
import { ZonesService } from './zones.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  userGeolocation: { lat: number, lng: number };

  private autocompleteService: google.maps.places.AutocompleteService;
  private geocoder: google.maps.Geocoder;
  private directionsRenderer: google.maps.DirectionsRenderer;
  private markers: google.maps.Marker[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private distanceTimeService: DistanceTimeService, 
    private googleMapsLoaderService: GoogleMapsLoaderService,
    private zonesService: ZonesService
  ) {
    this.initAutocompleteService();
    this.initGeocoder();
    this.initDirectionsRenderer();
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

  private initDirectionsRenderer() {
    this.googleMapsLoaderService.load().then(() => {
      this.directionsRenderer = new google.maps.DirectionsRenderer();
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
      this.directionsRenderer.setMap(map);
      this.zonesService.createNewZone(map);
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
      zoom: 10
    });

    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      draggable: true,
      title: 'Current Location'
    });

    this.markers.push(marker);

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

    this.markers.push(marker);

    return marker;
  }

  getDirections(fromLocation: { lat: number, lng: number }, toLocation: { lat: number, lng: number }, waypoints: google.maps.DirectionsWaypoint[] = []): Promise<google.maps.DirectionsResult> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route({
        origin: new google.maps.LatLng(fromLocation.lat, fromLocation.lng),
        destination: new google.maps.LatLng(toLocation.lat, toLocation.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING
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
    this.directionsRenderer.setMap(null); // Clear existing directions
    this.directionsRenderer.setMap(map); // Set new map
    this.directionsRenderer.setDirections(directions);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

addPolygon(map: google.maps.Map, coords: { lat: number, lng: number }[]): google.maps.Polygon {
  const polygon = new google.maps.Polygon({
    paths: coords,
    strokeColor: '#00FF00',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    editable: true, // Make polygon editable
    draggable: true // Optionally, make the polygon draggable
  });

  polygon.setMap(map);
  console.log("MAP SERVICE POLYGON: ", polygon);

  // Add event listeners for changes to the polygon
  this.addPolygonListeners(polygon);

  return polygon;
}

// Add event listeners to the polygon for drag and edit events
addPolygonListeners(polygon: google.maps.Polygon) {
  // Listen for when a vertex is moved
  google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
    this.handlePolygonChange(polygon);
  });

  // Listen for when a new vertex is added or a vertex is deleted
  google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
    this.handlePolygonChange(polygon);
  });
  
  // Listen for when the polygon is dragged
  google.maps.event.addListener(polygon, 'dragend', () => {
    this.handlePolygonChange(polygon);
  });
}

// Handle changes to the polygon and emit the updated coordinates
handlePolygonChange(polygon: google.maps.Polygon) {
  const updatedCoords: google.maps.LatLngLiteral[] = polygon.getPath().getArray().map(latLng => {
    return { lat: latLng.lat(), lng: latLng.lng() };
  });
  // return updatedCoords
  // Emit the updated coordinates via ZonesService or other mechanisms
  this.zonesService.polygonCoordinatesChanged.emit(updatedCoords);
  console.log("Polygon updated, new coordinates: ", updatedCoords);
}

  
  
  
}
