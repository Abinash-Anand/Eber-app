import { Injectable, EventEmitter } from '@angular/core';
import { MapService } from './mapsApi.service';
import { Coordinateslatlng } from '../../shared/coordinateslatlng';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  zoneCoordinates: Coordinateslatlng;
  location: { lat: number, lng: number };
  polygonCoordinatesChanged: EventEmitter<google.maps.LatLngLiteral[]> = new EventEmitter();

  constructor() {}

  createNewZone(map: google.maps.Map) {
    google.maps.event.addListener(map, 'click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const hexagonCoords = this.calculateHexagonCoords(e.latLng, 0.04); // Define the radius as needed

        // Create a hexagon (polygon)
        const hexagon = new google.maps.Polygon({
          paths: hexagonCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FF00',
          fillOpacity: 0.35,
          map: map,
          editable: true, // Make the polygon editable
          draggable: true // Make the polygon draggable
        });

        // Add listeners for editing and dragging
        this.addPolygonListeners(hexagon);
      }
    });
  }

  // Function to calculate the vertices of a hexagon
  private calculateHexagonCoords(center: google.maps.LatLng, radius: number): google.maps.LatLngLiteral[] {
    const hexagonCoords: google.maps.LatLngLiteral[] = [];
    for (let angle = 0; angle < 360; angle += 60) {
      const theta = angle * (Math.PI / 180);
      const lat = center.lat() + radius * Math.cos(theta);
      const lng = center.lng() + radius * Math.sin(theta);
      hexagonCoords.push({ lat, lng });
    }
    return hexagonCoords;
  }

  private addPolygonListeners(polygon: google.maps.Polygon) {
    // Listener for drag end event
    google.maps.event.addListener(polygon, 'dragend', () => {
      this.handlePolygonChange(polygon);
    });

    // Listener for edit event (vertex added or moved)
    google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
      this.handlePolygonChange(polygon);
      
    });
  }

  private handlePolygonChange(polygon: google.maps.Polygon) {
    const updatedCoords: google.maps.LatLngLiteral[] = polygon.getPath().getArray().map(latLng => {
      return { lat: latLng.lat(), lng: latLng.lng() };
    });
    
    // Emit the updated coordinates
    console.log("updatedCoords: ", updatedCoords);
    this.polygonCoordinatesChanged.emit(updatedCoords);
  }
}


