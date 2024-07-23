// confirm-ride.component.ts
import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';

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

  constructor(private rideService: RideService, private socketService: SocketService) {}

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
    this.filteredRides = this.rides.filter(ride => !vehicle || ride.vehicleType === vehicle);
  }

  searchRides(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRides = this.rides.filter(ride =>
      ride.userName.toLowerCase().includes(query) ||
      ride.phone.toLowerCase().includes(query) ||
      ride.requestId.toLowerCase().includes(query)
    );
  }

  updateStatus(ride: any, status: string): void {
    this.rideService.updateRideStatus(ride._id, status).subscribe(
      updatedRide => {
        ride.status = updatedRide.status;
      },
      error => {
        console.error('Error updating status:', error);
      }
    );
  }

  assignDriver(ride: any): void {
    // Logic to assign a driver
  }

  cancelRide(ride: any): void {
    // Logic to cancel the ride
  }
}
