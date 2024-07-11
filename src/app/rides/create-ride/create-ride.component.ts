import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/users/user.service';
import { CreateRideService } from '../../services/rides/create-ride.service';
import { MapService } from '../../services/maps/mapsApi.service';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.css']
})
export class CreateRideComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef') mapElement: ElementRef;
  requestForm: FormGroup;
  userError: string;
  isFormEnabled: boolean = false;
  stopControls: { control: FormControl }[] = [];
  stopLocations: { address: string, location: { lat: number, lng: number } }[] = [];
  estimate: { time: string, distance: string };
  serviceTypes: any[] = [];
  userFoundAlert: boolean = false;
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];
  activeInput: 'pickupLocation' | 'dropOffLocation' | 'stopLocation' = 'pickupLocation';
  currentStopIndex: number | null = null; // Track the current stop index
  fromAddress: string = '';
  toAddress: string = '';
  stopAddress: string = '';
  userGeolocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  fromLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  toLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  map: google.maps.Map;
  totalDistance: string = '';
  EstimatedTime: string = '';
  mapActive: boolean = false;
  waypoints: any[] = [];
  startJourney: string = '';
  journeyStops: string = '';
  endJourney: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private createRideService: CreateRideService,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      phone: [null, Validators.required],
      paymentOption: [{ value: null, disabled: true }, Validators.required],
      pickupLocation: [{ value: '', disabled: true }, Validators.required],
      dropOffLocation: [{ value: '', disabled: true }, Validators.required],
      serviceType: [{ value: '', disabled: true }, Validators.required],
      bookingOption: ['', Validators.required],
      scheduleDateTime: [{ value: '', disabled: true }]
    });
    this.getUserLocation();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  fetchUserDetails() {
    const phoneNumber = this.requestForm.get('phone').value;
    const searchObject: { searchBy: string, searchInput: any } = { searchBy: 'phone', searchInput: phoneNumber };
    this.userService.getSpecificUser(searchObject).subscribe(
      user => {
        if (user) {
          this.isFormEnabled = true;
          this.userFoundAlert = true;
          setTimeout(() => {
            this.userFoundAlert = false;
          }, 2000);
          this.mapActive = true;
          this.requestForm.get('paymentOption').enable();
          this.requestForm.get('pickupLocation').enable();
          this.requestForm.get('dropOffLocation').enable();
          this.requestForm.get('serviceType').enable();
        } else {
          this.userError = 'User does not exist';
          this.isFormEnabled = false;
        }
      },
      error => {
        this.userError = 'Error fetching user details';
        this.isFormEnabled = false;
      }
    );
  }

  addStop() {
    if (this.stopControls.length < 3) { // Assuming max 3 stops
      const control = new FormControl('', Validators.required);
      this.stopControls.push({ control });
    }
  }

  onSearchChange(search: string, type: 'pickupLocation' | 'dropOffLocation' | 'stopLocation', index?: number) {
    this.activeInput = type;
    if (type === 'stopLocation' && index !== undefined) {
      this.currentStopIndex = index; // Set the current stop index
    }
    if (search === '') {
      return this.suggestions = [];
    }
    this.mapService.getPlacePredictions(search).then(
      results => this.suggestions = results,
      error => console.error('Error getting place predictions', error)
    );
  }

  onSuggestionClick(suggestion: google.maps.places.QueryAutocompletePrediction, type: 'pickupLocation' | 'dropOffLocation' | 'stopLocation', index?: number) {
    this.mapService.clearMarkers();
    if (type === 'pickupLocation') {
      this.fromAddress = suggestion.description;
      console.log(this.fromAddress);
      
      this.mapService.geocodeAddress(this.fromAddress).then(results => {
        this.fromLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        this.mapService.addMarker(this.map, this.fromLocation, 'Start', 'red');
        if (this.fromLocation && this.toLocation) {
          this.calculateRoute();
        }
      }).catch(error => {
        console.error('Error geocoding address:', error);
      });
    } else if (type === 'dropOffLocation') {
      this.toAddress = suggestion.description;
      this.mapService.geocodeAddress(this.toAddress).then(results => {
        this.toLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        this.mapService.addMarker(this.map, this.toLocation, 'End', 'green');
        if (this.fromLocation && this.toLocation) {
          this.calculateRoute();
        }
      }).catch(error => {
        console.error('Error geocoding address:', error);
      });
    } else if (type === 'stopLocation' && index !== undefined) {
      this.stopAddress = suggestion.description;
      this.mapService.geocodeAddress(this.stopAddress).then(results => {
        const stopLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        if (this.stopLocations.length <= index) {
          this.stopLocations.push({ address: this.stopAddress, location: stopLocation });
        } else {
          this.stopLocations[index] = { address: this.stopAddress, location: stopLocation };
        }
        this.mapService.addMarker(this.map, stopLocation, `Stop ${index + 1}`, 'blue');
        if (this.fromLocation && this.toLocation) {
          this.calculateRoute();
        }
      }).catch(error => {
        console.error('Error geocoding address:', error);
      });
    }
    this.suggestions = [];
  }

  getUserLocation() {
    if (typeof window !== 'undefined') {
      this.mapService.getLocationService().then(response => {
        this.userGeolocation = response;
        this.initializeMap();
      }).catch(error => {
        console.error('Error getting user location:', error);
      });
    }
  }

  initializeMap() {
    if (this.mapElement && this.mapElement.nativeElement && this.userGeolocation.lat !== 0 && this.userGeolocation.lng !== 0) {
      if (typeof window !== 'undefined') {
        this.mapService.googleMapsApi(this.mapElement.nativeElement, this.userGeolocation, this.onMarkerDragEnd.bind(this)).then(map => {
          this.map = map;
        }).catch(error => {
          console.error('Error initializing map:', error);
        });
      }
    }
  }

  onMarkerDragEnd(location: { lat: number, lng: number }) {
    this.mapService.reverseGeocode(location).then(results => {
      const address = results[0].formatted_address;
      this.fromAddress = address;
      this.fromLocation = location;
    }).catch(error => {
      console.error('Error reverse geocoding:', error);
    });
  }

  calculateRoute() {
    this.waypoints = this.stopLocations.map(stop => ({
      location: new google.maps.LatLng(stop.location.lat, stop.location.lng),
      stopover: true
    }));

    this.mapService.getDirections(this.fromLocation, this.toLocation, this.waypoints).then(result => {
      this.mapService.renderDirections(this.map, result);
      const route = result.routes[0];
      if (route) {
        const leg = route.legs[0];
        this.EstimatedTime = leg.duration.text;
        this.totalDistance = leg.distance.text;
      }
    }).catch(error => {
      console.error('Directions error:', error);
    });
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.createRideService.bookRide(this.requestForm.value).subscribe(
        response => {
          console.log('Ride booked successfully', response);
        },
        error => {
          console.error('Error booking ride', error);
        }
      );
    }
  }
}
