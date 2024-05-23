import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  constructor() {}

  createZone(map: google.maps.Map) {
    // Define the bounds for the rectangle covering Pune
    const rectangleBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(18.446926, 73.787939), // Southwest corner (covers Pimpri-Chinchwad and Pune)
      new google.maps.LatLng(18.608726, 73.900177)  // // Northeast corner of Pune
    );

    // Center of the rectangle bounds
    const rectangleCenter = rectangleBounds.getCenter();

    // Create a rectangle covering Pune
    const rectangle = new google.maps.Rectangle({
      bounds: rectangleBounds,
      fillColor: '#00FF00',
      strokeColor: 'red',
      map: map
    });

    // Define the bounds for the hexagon covering Pimpri-Chinchwad
    const hexagonBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(18.6114, 73.7718), // Southwest corner of Pimpri-Chinchwad
      new google.maps.LatLng(18.6684, 73.8475)  // Northeast corner of Pimpri-Chinchwad
    );

    // Center of the hexagon bounds
    const hexagonCenter = hexagonBounds.getCenter();

    // Define the radius of the hexagon (in degrees)
    const radius = 0.04;

    // Calculate the hexagon vertices
    const hexagonCoords = this.calculateHexagonCoords(hexagonCenter, radius);

    // Create a hexagon (polygon) covering Pimpri-Chinchwad
    const hexagon = new google.maps.Polygon({
      paths: hexagonCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.35,
      map: map
    });

    return [rectangle, hexagon];
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
}
