import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../services/maps/mapsApi.service';
import { CityService } from '../services/city/city.service';
import { ZonesService } from '../services/maps/zones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef') mapElement: ElementRef;
  searchAddress: string = ''; // New property for search address
  fromAddress: string = '';
  toAddress: string = '';
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];
  userGeolocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  fromLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  toLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  searchLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
 private currentPolygon: any;  // Add this to track the current polygon
  Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000
  });
  markerPosition: any;
  map: google.maps.Map;
  google: any;
  activeInput: 'from' | 'to' | 'search' = 'from'; // Updated activeInput type
  activeClass: boolean = false;   
  totalDistance: string = '';
  EstimatedTime: string = '';

  //zone variables
  resultMessage: string = '';  // Result message for displaying inside/outside polygon check
  resultColor: string = '';    // Color of the result message (red/green)
  coords: { lat: number, lng: number }[]
  constructor(private mapService: MapService,
    private cityService: CityService,
    private zoneService: ZonesService
  ) {}

  ngOnInit(): void {
    // Fetch the user's current geolocation when the component initializes
    // console.log(this.activeInput);

    
  this.getUserLocation();
    }
  getUserLiveLocation() {
    console.log("geolocation activated");
    
      this.getUserLocation()
    }
  
    ngAfterViewInit() {
      // Initialize the map after the view has been initialized
      this.initializeMap();
    console.log(this.activeInput);
    
  }

  getUserLocation() {
    if (typeof window !== 'undefined') {
      // Use the map service to get the user's current geolocation
        this.mapService.getLocationService().then(response => {
        this.userGeolocation = response;
        // Initialize the map with the user's current location
        this.initializeMap();
      }).catch(error => {
        console.error('Error getting user location:', error);
      });
    }
  }
  
  initializeMap() {

    if (this.mapElement && this.mapElement.nativeElement && this.userGeolocation.lat !== 0 && this.userGeolocation.lng !== 0) {
      if (typeof window !== 'undefined') {
        // Initialize the Google Map with the user's geolocation
        this.mapService.googleMapsApi(this.mapElement.nativeElement, this.userGeolocation, this.onMarkerDragEnd.bind(this)).then(map => {
          this.map = map;
            // Create a polygon (zone) for checking
       
        }).catch(error => {
          console.error('Error initializing map:', error);
        });
      }
    }
  }



  drawPolygon() {
    console.log("From Address: ", this.fromAddress);
    
    // Fetch zone data from cityService
    this.cityService.getSpecificZoneData(this.fromAddress).subscribe((response) => {
      if (response.length === 1) {
        this.coords = JSON.parse(response[0].latLngCoords);  // Ensure response[0].latLngCoords is the correct format: [{ lat, lng }]
        console.log("Coords: ", this.coords); // Log the coordinates for debugging
        
        // Check if the map is initialized
        if (this.map) {
          // Remove the previous polygon if it exists
          if (this.currentPolygon) {
            this.currentPolygon.setMap(null);  // Removes the polygon from the map
         this.checkIfMarkerInsideZone(this.markerPosition)

          }
          
          // Add the new polygon to the map using MapService
          this.currentPolygon = this.mapService.addPolygon(this.map, this.coords);
         this.checkIfMarkerInsideZone(this.markerPosition)

        } else {
          console.error("Map is not initialized yet!");
         
        }
      } else {
        console.error("No valid zone data found.");
      }
    }, (error) => {
      console.error("Error fetching zone data: ", error);
    });

  }
// Add this check in your component

checkIfMarkerInsideZone(markerPosition: google.maps.LatLng): boolean {
  if (this.currentPolygon) {
    // Check if the marker position is inside the polygon
    const isInside = google.maps.geometry.poly.containsLocation(markerPosition, this.currentPolygon);

    if (isInside) {
      console.log("The marker is inside the zone.");
        this.Toast.fire({
             icon: 'success',  
          title: 'The marker is inside the zone!'
            })
    } else {
        this.Toast.fire({
             icon: 'error',  
          title: 'The marker is outside the zone.'
            })
      console.log("The marker is outside the zone.");
    }
    
    return isInside;
  } else {
      this.Toast.fire({
             icon: 'error',  
             title: 'No polygon is currently drawn on the map.'
            })
    console.error("No polygon is currently drawn on the map.");
    return false;
  }
}

  onSearchChange(search: string, type: 'from' | 'to' | 'search') { // Updated function signature
    this.activeInput = type;
    // console.log(this.activeInput);
    
    if (search === '') {
      
      console.log("Suggestions Array",this.suggestions);
      return this.suggestions = [];
      
    }
    if (typeof window !== 'undefined') {
      // Use the map service to get place predictions based on the search input
      this.mapService.getPlacePredictions(search).then(results => {
        this.suggestions = results;
        console.log(this.suggestions);
         
      }).catch(error => {
        console.error('Error getting place predictions:', error);
      });
    }
  }


  onSuggestionClick(suggestion: google.maps.places.QueryAutocompletePrediction, type: 'from' | 'to'| 'search') {
    this.mapService.clearMarkers()
    if (type === 'search') {
      this.fromAddress = suggestion.description
      
      if (typeof window !== 'undefined') {
        this.mapService.geocodeAddress(this.searchAddress).then(results => {
        this.searchLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
          this.mapService.addMarker(this.map, this.fromLocation, 'Start', 'red');
          if (this.searchLocation) {
            this.mapService.getLocationService();
          }

        })
      }
    }


    if (type === 'from') {
      this.fromAddress = suggestion.description;
      if (typeof window !== 'undefined') {
        // Geocode the selected address and add a marker to the map
        this.mapService.geocodeAddress(this.fromAddress).then(results => {
          this.fromLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
          this.mapService.addMarker(this.map, this.fromLocation, 'Start', 'red');
          console.log("From add: ", this.fromAddress);
          this.markerPosition = new google.maps.LatLng(this.fromLocation.lat, this.fromLocation.lng);
         this.drawPolygon();
         
         this.checkIfMarkerInsideZone(this.markerPosition)

          if (this.fromLocation && this.toLocation) {
            // Calculate the route if both from and to locations are set
            this.calculateRoute();
          }console.log(this.fromLocation, this.toLocation);
          
          
        }).catch(error => {
          console.error('Error geocoding address:', error);
        });
      }
    } else {
      this.toAddress = suggestion.description;
      if (typeof window !== 'undefined') {
        // Geocode the selected address and add a marker to the map
        this.mapService.geocodeAddress(this.toAddress).then(results => {
          this.toLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
          this.mapService.addMarker(this.map, this.toLocation, 'End', 'green');
          if (this.fromLocation && this.toLocation) {
            // Calculate the route if both from and to locations are set
            this.calculateRoute();
          }
        
        }).catch(error => {
          console.error('Error geocoding address:', error);
        });
      }
    }
    this.suggestions = [];
  }

  onMarkerDragEnd(location: { lat: number, lng: number }) {
    if (typeof window !== 'undefined') {
      // Reverse geocode the location where the marker was dragged and update the address
      this.mapService.reverseGeocode(location).then(results => {
        const address = results[0].formatted_address;
        this.fromAddress = address;
        this.fromLocation = location;
         // Set the markerPosition
      this.markerPosition = new google.maps.LatLng(location.lat, location.lng);

      // Call the checkIfMarkerInsideZone function after the marker is dragged
      this.checkIfMarkerInsideZone(this.markerPosition);
      }).catch(error => {
        console.error('Error reverse geocoding:', error);
      });
    }
  }

  calculateRoute() {
    if (typeof window !== 'undefined') {
      // Get directions between the from and to locations and render them on the map
      this.mapService.getDirections(this.fromLocation, this.toLocation).then(result => {
        this.mapService.renderDirections(this.map, result);
        const route = result.routes[0];
        if (route) {
          const leg = route.legs[0];
          // Update the estimated time and total distance
          this.EstimatedTime = leg.duration.text;
          this.totalDistance = leg.distance.text;
          // console.log(`Distance: ${leg.distance.text}, Duration: ${leg.duration.text}`);
        }
      }).catch(error => {
        console.error('Directions error:', error);
      });
    }
  }

  onSelectDirection() {
    // Toggle the active class when a direction is selected
    this.activeClass = !this.activeClass;
  }
  

}
