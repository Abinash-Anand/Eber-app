import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';
import { DriverlistService } from '../../services/drivers/driverlist.service';

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
  driverList: any[] = [];
  selectedDriver: any = null;
  filteredDriverList: any[] = [];
  selectedDriverIndex: number | null = null; // Track the selected driver's index
  disableDriver: boolean = false;
  constructor(private rideService: RideService,
              private socketService: SocketService,
              private driverListService: DriverlistService) { }

  ngOnInit(): void {
    this.fetchConfirmedRides();
    this.listenForNewRides();
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
    this.rideObject.status = status;
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

  onAssignBooking(ride: any): void {
    this.selectedRide = ride;
    this.driverListService.getDrivers().subscribe((drivers) => {
      if (drivers.status === 200) {
        this.driverList = drivers.body;
        console.log(this.driverList);
        console.log("booking Request: ", ride);
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
      this.updateStatus(this.selectedRide);
      console.log('Assign Selected Driver:', this.selectedRide);
      this.driverAssigned = true;
    }
  }

  assignAnyAvailableDriver(): void {
    console.log("Allot any available driver!");

    if (this.selectedRide) {
      const availableDriver = this.driverList.find(driver => driver.available);
      if (availableDriver) {
        console.log('Assign Any Available Driver:', availableDriver, this.selectedRide);
        this.selectedRide.driver = availableDriver;
        this.updateStatus(this.selectedRide);
        this.driverAssigned = true;
      }
    }
  }
}
