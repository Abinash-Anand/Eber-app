// create-ride.component.ts
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/users/user.service';
import { CreateRideService } from '../../services/rides/create-ride.service';
import { MapService } from '../../services/maps/mapsApi.service';
import { SettingsService } from '../../services/settings/settings.service';
import { VehiclePricingService } from '../../services/pricing/vehicle-pricing.service';
import { CityService } from '../../services/city/city.service';
import { Pricing } from '../../shared/pricing';
import { Zone } from 'zone.js/lib/zone-impl';
import { PricingArray } from '../../shared/pricing-array';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../shared/vehicle';
import { CreateRideForm } from '../../shared/create-ride-form';
import { PaymentService } from '../../services/payment/payment.service';
import { response } from 'express';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  userFoundAlert: boolean = false;
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];
  activeInput: 'pickupLocation' | 'dropOffLocation' | 'stopLocation' = 'pickupLocation';
  currentStopIndex: number | null = null;
  fromAddress: string = '';
  toAddress: string = '';
  cards: {}[] = []
  selectedRideTypeIndex: number = null;
  stopAddress: string = '';
  userGeolocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  fromLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  toLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  map: google.maps.Map;
  totalDistance: string = '';
  EstimatedTime: string = '';
  mapActive: boolean = false;
  cardId:string= '' 
  waypoints: google.maps.DirectionsWaypoint[] = [];
  numberOfStops: number = null;
  requestAcceptTime: number = null;
  serviceTypes: Pricing[] = [];
  filteredCityService: any[]=[]
  cityMap: { id: string, name: string }[] = [];
  cities: Zone[] = [];
  pricings: Pricing[] = [];
  formSubmitted: boolean = false
  loading:boolean = false
  // vehicleDataArray: Vehicle[] = [];
  filteredVehicles: {}[] = []
  user: string = ''
  newBookingObject: CreateRideForm = {
    userId:'',
    phone:null,
    paymentOption:'',
    fromLocation:'',
    toLocation:'',
    pickupLocation:'',
    dropOffLocation:'',
    stopLocations:'',
    totalDistance:'',
    EstimatedTime: '',
    totalFare:null,
    serviceType:'',
    bookingOption:'',
    scheduleDateTime: '',
    
  }
  Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
  });
    
  //----------Pricing Values---------------
  drvierProfit: number = null;
  time: number = null;
  distance: number = null;
  totalFare: number = null;
  minFare: number = null;
  distanceForBasePrice: number = null
  driverProfit: number = null
  pricePerUnitDistance: number = null
  pricePerUnitTime: number = null
  basePrice: number = null;
  estimatedDistance: number = null;
  // maxSpace: number = null;
  serviceSelected: boolean = false
  userId: string = ''
  //----------------------------------------
  serviceType: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private createRideService: CreateRideService,
    private mapService: MapService,
    private settingsService: SettingsService,
    private vehiclePricingService: VehiclePricingService,
    private pricingService: VehiclePricingService,
    private cityService: CityService,
    private paymentService: PaymentService,
    private vehicleTypeService: VehicleTypeService,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      phone: [null, Validators.required],
      paymentOption: [{ value: null, disabled: true }],
      selectedCard:[{value:''},Validators.required ],
      pickupLocation: [{ value: '', disabled: true }],
      dropOffLocation: [{ value: '', disabled: true }],
      serviceType: [{ value: '', disabled: true }],
      bookingOption: [''],
      scheduleDateTime: [{ value: '', disabled: true }],
      requestTimer:[{value: null}],
    });
    this.getUserLocation();
      this.getSettings()
   
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  loadInitialData(): void {
    this.cityService.getCitiesData().subscribe(cities => {
      this.cities = cities.body;
      cities.body.forEach(city => {
        this.cityMap.push({ id: city._id, name: city.city });
      });
      // console.log(this.cityMap);
      
    });

    this.pricingService.getPricingData().subscribe(pricings => {
      this.pricings = pricings.body;
    });
  }
//--------------calling filterpricing city by name which filters the services based on city----------

  filterPricingByCityName(cityName) {
    
    const value = this.pricings.filter(pricing => {
      // console.log(pricing.city , ' === ', cityName);
      return pricing.city === cityName
    });
    // console.log(value);
    this.filteredCityService = value
   
    
  }

  //fetch user card details
  fetchUserCardDetails(userId) {
    console.log(userId);
    
    this.paymentService.fetchUserCards(userId).subscribe((response) => {
      console.log(response);
      this.cards = response.body;
      
    })
  }
  onSelectedCard(event: Event) {
    console.log(event);
    const target = event.target as HTMLSelectElement
    const value = target.value
    
    this.requestForm.value.selectedCard = value
}

  fetchUserDetails() {
    const phoneNumber = this.requestForm.get('phone').value;
    const searchObject: { searchBy: string, searchInput: any } = { searchBy: 'phone', searchInput: phoneNumber };
    this.userService.getSpecificUser(searchObject).subscribe(
     ( user:any) => {
        if (user.status === 200) {
          console.log(user);
          this.userId = user.body._id
          console.log(this.userId);
          this.user = user.body.userProfile;
          this.isFormEnabled = true;
          // this.userFoundAlert = true;
        this.Toast.fire({
          icon: 'success',  
          title: 'User Account Exist'
        });
          // setTimeout(() => {
          //   this.userFoundAlert = false;
          // }, 2000);
          
          this.requestForm.get('paymentOption').enable();
          this.requestForm.get('pickupLocation').enable();
          this.requestForm.get('dropOffLocation').enable();
          this.requestForm.get('serviceType').enable();
          this.requestForm.get('scheduleDateTime').enable();  
          this.requestForm.patchValue({ requestTimer: this.requestAcceptTime });

          this.loadInitialData();
            console.log( this.cityMap);
        } else {
          // this.userError = 'User does not exist';
          this.isFormEnabled = false;

        }
      },
      error => {
          this.requestForm.get('paymentOption').disable();
          this.requestForm.get('pickupLocation').disable();
          this.requestForm.get('dropOffLocation').disable();
          this.requestForm.get('serviceType').disable();
          this.requestForm.get('scheduleDateTime').disable(); 
         this.Toast.fire({
          icon: 'error',  
          title: 'User Account does not Exist!'
        });
        // this.userError = 'Error fetching user details';
        this.isFormEnabled = false;
      }
    );
  }

  
  getSettings() {
    this.settingsService.getDefaultSettings().subscribe((setting) => {
        this.numberOfStops = setting.body[0].numberOfStops;
          this.requestAcceptTime = setting.body[0].requestAcceptTime;
          console.log("request time: ", this.requestAcceptTime);
          console.log("numbe of stops: ", this.numberOfStops);
  })
}


  addStop() {
    if (this.stopControls.length < this.numberOfStops) {
      const control = new FormControl('', Validators.required);
      this.stopControls.push({ control });
    }
  }

  removeStop(index: number) {
    this.stopControls.splice(index, 1);
    this.stopLocations.splice(index, 1);
    this.calculateRoute();
    this.mapService.clearMarkers();
  }

  onSearchChange(search: string, type: 'pickupLocation' | 'dropOffLocation' | 'stopLocation', index?: number) {
    this.activeInput = type;
    if (type === 'stopLocation' && index !== undefined) {
      this.currentStopIndex = index;
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
    
      
      const foundCity = this.cityMap.find(city => {
        const normalizedCityName = city.name.toLowerCase().trim();
        const normalizedFromAddress = this.fromAddress.toLowerCase().trim();

        return normalizedFromAddress.includes(normalizedCityName);
      });
      
      if (foundCity) {
        console.log('City found:', foundCity.name);
      } else {
        console.log('No city found in the suggestion description');
      }

      
      this.mapService.geocodeAddress(this.fromAddress).then(results => {
        this.fromLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        this.mapService.addMarker(this.map, this.fromLocation, 'Start', 'red');
        if (this.fromLocation && this.toLocation) {
          this.calculateRoute();
          // console.log("from Location: ", this.fromLocation, this.toLocation);
          
//--------------calling filterpricing city by name which filters the services based on city----------
          this.filterPricingByCityName(foundCity.id)
       
         
          // console.log(this.pricings);
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
          this.vehicleServices()
          this.mapActive = true;
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
        let totalDistance = 0;
        let totalDuration = 0;
        for (let i = 0; i < route.legs.length; i++) {
          totalDistance += route.legs[i].distance.value;
          totalDuration += route.legs[i].duration.value;
        }
        this.totalDistance = `${(totalDistance / 1000).toFixed(2)}`;
        this.EstimatedTime = `${Math.floor(totalDuration / 60)}`;
        this.time = +this.EstimatedTime
        this.distance = +this.totalDistance
//----After selecting to and from location-> calls the calculating engine -> calculates fare-------
        this.calculateFarePrice()

      }
    }).catch(error => {
      console.error('Error calculating route:', error);
    });
  }

  //-----------------calling the vehicle type service----------------------------------

  vehicleServices() {
  this.vehicleTypeService.onGetVehicle().subscribe((response: any) => {
  console.log(response); // Output: 'Vehicle data received!'
  const vehiclesArray = response.vehicles; // Access the vehicles array
  console.log("Output: Array of vehicles: ", vehiclesArray); // Output: Array of vehicles
  
  // Filter the vehicles based on the filteredCityService
  const filteredService = vehiclesArray.filter((vehicle) => {
    return this.filteredCityService.some((carType) => carType.vehicleType === vehicle.vehicleType);
  });

  // Create a map to keep track of unique vehicles and their counts
  const vehicleCountMap = new Map();

  // Populate the map with vehicle counts and related properties from filteredCityService
  filteredService.forEach((vehicle) => {
    const matchingPricing = this.filteredCityService.find(carType => carType.vehicleType === vehicle.vehicleType);
    if (matchingPricing) {
      if (vehicleCountMap.has(vehicle.vehicleType)) {
        const existingVehicle = vehicleCountMap.get(vehicle.vehicleType);
        existingVehicle.count += 1;
      } else {
        vehicleCountMap.set(vehicle.vehicleType, {
          count: 1,
          vehicleType: vehicle.vehicleType,
          maxSpace: matchingPricing.maxSpace,
          distanceForBasePrice: matchingPricing.distanceForBasePrice,
          driverProfit: matchingPricing.driverProfit,
          minFare: matchingPricing.minFare,
          pricePerUnitDistance: matchingPricing.pricePerUnitDistance,
          pricePerUnitTime: matchingPricing.pricePerUnitTime,
          vehicle: vehicle // Reference to the original vehicle object for other properties
        });
      }
    }
  });

  // Create an array of unique vehicles with counts and additional properties
  const uniqueFilteredService = Array.from(vehicleCountMap.values());

  this.filteredVehicles = uniqueFilteredService;
  // Log the unique filtered vehicles with counts and additional properties
  console.log("Unique Filtered Vehicles are: ", this.filteredVehicles);
});

      /* 
    serviceType =   [{
      -------1st array------
      vehicleType: 'Sedan',
      vehicleName: 'Hyundai Verna',
      vehicleImage: 'Vehicle Image', 
      totalVehicleCount: 10
      seatingCapacity: 6,
      -------2nd array-----
      katraj--->kothrud
      distance: 9km,
      estimatedTime: 30mins,
      rideTotalFare: 120,
      }]
      */

  }
  


  //--------------------------CALCULATING FARE FOR JOURNEY-----------------------
  calculateFarePrice() {
    console.log("Unique Filtered Vehicles are: ", this.filteredCityService);
    /* 
  drvierProfit: number = 80;
  minFare: number = 25;
  basePrice: number = 20;
  unitDistance: number = 10;
  unitTimePrice: number = 1;
  basePriceDistance: number = 1;

  -----calculations for pricing
  example: total distance = 7.53, total time = 10 min
            base price = 20 for a mile which is fixed
            unit distance price = 10 * 6.53 = 65.3
            time price = unitTimePrice * 10 // 1 *10 = 10
            totalFair = time price + unit distance price + base  price 
            totalFair = 10 + 65.3 + 20 = 95.3
            Driver profit = (95.3/100) * 80 = 67.24 
            comission to the platform =  95.3 -67-24 = 28.06 

    */
    //  const drvierProfit: number = 80;
    //  const minFare: number = 25;
    //  const basePrice: number = 20; //for 1 km
    //  const unitDistancePrice: number = 10;
    const unitTimePrice: number = 1; //for 1min in $
    const basePriceDistance: number = 1;
  



    //------------------------
    this.distanceForBasePrice = this.filteredCityService[0].distanceForBasePrice
    this.driverProfit = this.filteredCityService[0].driverProfit
    this.minFare = this.filteredCityService[0].minFare
    // this.basePrice = this.filteredCityService[0].basePrice
    this.pricePerUnitDistance = this.filteredCityService[0].pricePerUnitDistance
    this.pricePerUnitTime = this.filteredCityService[0].pricePerUnitTime
    console.log("distance: ", this.totalDistance, " + ", "Estimated time " + this.EstimatedTime);
    
    //-------------------------------------------------------------
      if (+this.totalDistance <= basePriceDistance && +this.EstimatedTime <= unitTimePrice ){
        this.totalFare = this.minFare
        console.log("Total Fare: ",this.totalFare);
        
      }
      else if (+this.totalDistance && +this.EstimatedTime) {
    
      const totalDistanceExculudingBaseDistance = +this.totalDistance - this.distanceForBasePrice;
      const unitDistancePrice = +totalDistanceExculudingBaseDistance * this.pricePerUnitDistance;
      const timePrice = this.pricePerUnitTime * +this.EstimatedTime;
        this.totalFare = +(timePrice + unitDistancePrice + this.basePrice).toFixed(2)
        this.driverProfit = (this.totalFare / 100) * 80;
        
        console.log("Total Fare: ",this.totalFare);
        console.log("total Distance: ", this.totalDistance);

    }
  
    
  }
  //------------------------Get Service ---------------------------------

  onSelectService(vehicleDetails, i) {
    this.selectedRideTypeIndex = i
    this.serviceType = vehicleDetails.vehicleType;
    this.serviceSelected = true;
     this.requestForm.get('serviceType').setValue(this.serviceType);
     
  }

  onSubmit() {
    console.log('Form Valid:', this.requestForm.valid);
    // console.log('Form Value:', this.requestForm.value);

    if (this.requestForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    if (!this.isFormEnabled) {
      console.error('Form is not enabled');
      return;
    }

    const formData = this.requestForm.value;
    formData.fromLocation = JSON.stringify(this.fromLocation) ;
    formData.toLocation = JSON.stringify(this.toLocation);
    formData.stopLocations = JSON.stringify(this.stopLocations);
    formData.totalDistance = this.totalDistance;
    formData.EstimatedTime = this.EstimatedTime;
    this.newBookingObject = formData
    this.newBookingObject.userId = this.userId
    this.newBookingObject.totalFare = this.totalFare;
    console.log('Form Data:', this.newBookingObject);
    // this.newBookingObject = {
    //   phone:formData.phone,
    // paymentOption:formData.paymentOption,
    // fromLocation:formData.fromLocation,
    // toLocation:formData.toLocation,
    // pickupLocation:formData.pickupLocation,
    // dropOffLocation:formData.dropOffLocation,
    // stopLocations:formData.stopLocation,
    // totalDistance:formData.totalDistance,
    // EstimatedTime: formData.estimatedTime,
    // serviceType:formData.serviceType,
    // bookingOption:formData.bookingOption,
    // scheduleDateTime: formData.scheduleDateTime,
    // }
    // console.log(this.newBookingObject);
    if (formData.bookingOption === 'now') {
      formData.scheduleDateTime = new Date().toISOString().slice(0, 16); // Set the current date and time
    }
    if (this.cardId === 'cash') {
      formData.selectedCard = 'cash';
    }
    console.log("Selectedcard: ",formData.selectedCard);
    
    this.createRideService.bookRide(this.newBookingObject).subscribe(
     ( response:any) => {
        console.log('Ride created successfully:', response);
        if (response) {
             Swal.fire({
        title: 'Success!',
        text: "Your Ride Request Has Been Created. You'll be redirected to Confirmed Rides ",
        icon: 'success',
        confirmButtonText: 'OK'
               });
          this.formSubmitted = true;
          this.loading = true
          setTimeout(() => {
            this.formSubmitted = false
            this.router.navigate(['/rides/confirm-ride'])
        }, 3000);
        } else {
            this.Toast.fire({
          icon: 'error',  
          title: 'User Account does not Exist'
        });
        }
       
      },
      error => {
          this.Toast.fire({
          icon: 'error',  
          title: 'Error occured while Creating a Ride Request'
        });
        console.error('Error creating ride:', error);
      }
    );
  }

  //selecting card payment
  onSelectCardPayment(value: string) {
    this.cardId = value;
    
    if (this.cardId !== 'cash') {
          console.log("payment type: ", this.cardId);
            this.fetchUserCardDetails(this.userId)
    } else if(this.cardId === 'cash') {
      this.requestForm.value.selectedCard = ''
      console.log("payment type: ", this.requestForm.value.selectedCard);
      
          }
  }
  validateCard() {
    
  }
}
