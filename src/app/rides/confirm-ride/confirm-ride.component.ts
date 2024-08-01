import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';
import { DriverlistService } from '../../services/drivers/driverlist.service';
import { Ride } from '../../shared/ride';

@Component({
  selector: 'app-confirmed-rides',
  templateUrl: './confirm-ride.component.html',
  styleUrls: ['./confirm-ride.component.css']
})
export class ConfirmRideComponent implements OnInit {
  rides: any[] = [];
  filteredRides: any[] = [];
  statusOptions: string[] = ['Accepted', 'Arrived', 'Picked', 'Started', 'Completed'];
  vehicleOptions: string[] = ['SUV', 'Sedan', 'Rikshaw', 'Electric', 'HatchBack'];
  rideObject: any;
  selectedRide: any;
  driverAssigned: boolean = false;
  rideAccepted: boolean = false;
  driverList: any[] = [];
  selectedDriver: any = null;
  filteredDriverList: any[] = [];
  selectedDriverIndex: number | null = null; // Track the selected driver's index
  disableDriver: boolean = false;
  rideBooked: Ride;
  rideStatus:string= ''
  constructor(private rideService: RideService,
              private socketService: SocketService,
              private driverListService: DriverlistService) { }

  ngOnInit(): void {
    this.fetchConfirmedRides();
    this.listenForNewRides();
      // this.updateFilteredRides();
  }

  fetchConfirmedRides(): void {
    this.rideService.getConfirmedRides().subscribe((rides) => {
      this.rides = rides;
      this.filteredRides = rides;
    });
  }

  listenForNewRides(): void {
    this.socketService.onNewRide().subscribe((newRide) => {
      this.rides.push(newRide);
      this.filteredRides = this.rides;
      console.log("New Ride Received: ", newRide);
    });
  }

  filterByStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.filteredRides = this.rides.filter(ride => !status || ride.status === status);
  }

  filterByVehicle(event: Event): void {
    const vehicle = (event.target as HTMLSelectElement).value;
    this.filteredRides = this.rides.filter(ride => !vehicle || ride.serviceType === vehicle);
  }

  searchRides(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRides = this.rides.filter(ride =>
      (ride.userId?.username && ride.userId.username.toLowerCase().includes(query)) ||
      (ride.userId?.phone && ride.userId.phone.toLowerCase().includes(query)) ||
      (ride._id && ride._id.toLowerCase().includes(query))
    );
  }

  updateStatus(ride: any): void {
    this.rideService.updateRideStatus(ride._id, ride).subscribe(
      updatedRide => {
        ride.status = updatedRide.status;
      },
      error => {
        console.error('Error updating status:', error);
      }
    );
  }

  assignDriver(ride: any, status: string): void {
    this.rideObject = ride;
    this.rideStatus = status
    this.updateStatus(this.rideObject);
    this.socketService.onAssignDriverToRide().subscribe((driverAssigned) => {
      console.log(driverAssigned);
    });
  }

  cancelRide(rideId: string): void {
    this.rideService.cancelRide(rideId).subscribe((cancelledRide) => {
      this.fetchConfirmedRides();
    });
  }

  onAssignBooking(ride: any, status:string): void {
    this.selectedRide = ride;
    console.log("Checking: ",this.selectedRide);
    this.rideStatus = status;
    this.driverListService.getDrivers().subscribe((drivers) => {
      if (drivers.status === 200) {
        this.driverList = drivers.body;
        // console.log(this.driverList);
        // console.log("booking Request: ", ride);
        this.filterDriverList(ride);
        
      }
    });
  }

  filterDriverList(ride: any): void {
    const filterDriver = this.driverList.filter((driver) => {
      if (driver.driverObjectId.status.toLowerCase() === 'approved') {
        return ride.pickupLocation.includes(driver.driverObjectId.city) ;
        
      }
    });
    console.log("Filtered drivers: ", filterDriver);

    this.filteredDriverList = filterDriver;
  }

  onDriverSelect(driver: any, index: number): void {
    
    this.selectedDriver = driver;
    
    this.selectedDriverIndex = index;
    console.log(this.selectedDriverIndex);
    
    if (this.selectedDriverIndex >= 0) {
      this.disableDriver = true
      console.log("driverSelected");
     
      
    } else {
      this.disableDriver = false
    }
    console.log('Driver selected:', driver);
  }

  assignSelectedDriver(): void {
    if (this.selectedDriver && this.selectedRide) {
      this.selectedRide.driver = this.selectedDriver;
      this.selectedRide.status = this.rideStatus;
     
      // console.log("Checking...",this.selectedRide);
      
      this.rideService.submitRideRequestData(this.selectedRide).subscribe((rideResponse) => {
        console.log(rideResponse);
        if (rideResponse.status === 201) {
          this.rideAccepted = true;
        } 
        setTimeout(() => {
          this.rideAccepted = false;
        }, 2000);
        
      })
       this.rideService.updateRideStatus(this.selectedRide._id, this.selectedRide).subscribe((response) => {
    this.fetchConfirmedRides();
        
      })
      console.log(this.selectedRide);
      this.driverAssigned = true;
      
    }
  }

  //-----------updating the filteredRides array to display the accepted rides-----------------
  // updateFilteredRides() {
  //   this.rideService.getAcceptedRides().subscribe((rideResponse) => {
  //     console.log(rideResponse);
  //     console.log(this.filteredRides);
      
  //     const updatedRidesArray = this.filteredRides.filter((ride) => {
  //       rideResponse.some((acceptedRide) => {
  //         return ride.status === acceptedRide.status
  //       })
  //     })
  //     this.filteredRides =  updatedRidesArray
  //     console.log(updatedRidesArray);
      
  //   })
  // }

/*
After the request has been assigned to a driver, there will be a predetermine duration window for the driver to 
accept the request (the admin can set the duration for the driver to accept in the Settings).
 4. The nearest driver who meets the specified criteria will receive the ride request
 1. Driver approved
 2. Driver have same vehicle
 3. Driver do not have any request running
*/
assignAnyAvailableDriver(): void {
  console.log("Allot any available driver!");
  console.log("Selected Ride: ", this.selectedRide);
  this.selectedRide.status = this.rideStatus;
  console.log("Ride service: ", this.selectedRide.serviceType);

  this.driverListService.getDrivers().subscribe((response) => {
    console.log("Drivers: ", response);
    this.driverList = response.body; // Ensure the driverList is correctly updated
    const nearestDriver = this.driverList.filter((driver) => {
      // Check if driver and driver.status are defined before using toLowerCase
      return driver.status === 'approved' && 
             driver.vehicleType === this.selectedRide.serviceType
    });
    console.log("Nearest Driver: ", nearestDriver);
    

    if (nearestDriver.length > 0) {
      const randomIndex = Math.floor(Math.random() * nearestDriver.length);
      const randomDriver = nearestDriver[randomIndex];
      console.log('Assign Any Available Driver:', randomDriver, this.selectedRide);
      this.selectedRide.driver = randomDriver;
      this.updateStatus(this.selectedRide);
      this.driverAssigned = true;
      
    } else {
      console.log('No available drivers found.');
    }
  }, (error) => {
    console.error('Error fetching drivers:', error);
  });
}


  
}
