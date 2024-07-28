// confirm-ride.component.ts
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
  driverAssigned: boolean = false;
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
        console.log("Checking ride status: ", ride);
        ride.status = updatedRide.status;
        console.log("Checking ride status 2: ", updatedRide.status);
      },
      error => {
        console.error('Error updating status:', error);
      }
    );
  }

  assignDriver(ride: any, status: string): void {
    this.rideObject = ride;
    this.rideObject.status = status;
    console.log("logging assign event: ", ride);
    this.updateStatus(this.rideObject);
    this.socketService.onAssignDriverToRide().subscribe((driverAssigned) => {
      console.log(driverAssigned);
      
    })
  }

  cancelRide(rideId: string): void {
    this.rideService.cancelRide(rideId).subscribe((cancelledRide) => {
      console.log("Ride Cancelled: ", cancelledRide);
      this.fetchConfirmedRides();
    });
  }



}
