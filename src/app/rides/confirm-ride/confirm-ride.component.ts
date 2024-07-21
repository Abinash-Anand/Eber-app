import { Component, OnInit } from '@angular/core';
// import { RideService } from '../services/ride.service';
import { Socket } from 'socket.io-client';
import { RideService } from '../../services/confirm-ride/ride.service';
// import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-confirm-ride',
  templateUrl: './confirm-ride.component.html',
  styleUrl: './confirm-ride.component.css'
})
export class ConfirmRideComponent implements OnInit {
rides: any[] = [];
  filteredRides: any[] = [];
  filterStatus: string = '';
  filterVehicle: string = '';
  searchUsername: string = '';
  searchPhoneNumber: string = '';
  searchRequestId: string = '';
  fromDate: string = '';
  toDate: string = '';

  constructor(private rideService: RideService, private socket: Socket) {}

  ngOnInit(): void {
    this.getConfirmedRides();

    // Listen to real-time updates
    this.socket.on('rideUpdated', (ride) => {
      this.updateRideInList(ride);
    });
  }

  getConfirmedRides(): void {
    this.rideService.getConfirmedRides().subscribe((rides) => {
      this.rides = rides;
      this.filteredRides = rides;
  console.log(rides);
  
    });
  
  }

  updateRideInList(updatedRide): void {
    const index = this.rides.findIndex(ride => ride._id === updatedRide._id);
    if (index !== -1) {
      this.rides[index] = updatedRide;
    }
  }

  applyFilters(): void {
    this.filteredRides = this.rides.filter(ride => {
      return (!this.filterStatus || ride.status === this.filterStatus)
        && (!this.filterVehicle || ride.vehicleType === this.filterVehicle)
        && (!this.searchUsername || ride.username.includes(this.searchUsername))
        && (!this.searchPhoneNumber || ride.phoneNumber.includes(this.searchPhoneNumber))
        && (!this.searchRequestId || ride.requestId.includes(this.searchRequestId))
        && (!this.fromDate || new Date(ride.createdAt) >= new Date(this.fromDate))
        && (!this.toDate || new Date(ride.createdAt) <= new Date(this.toDate));
    });
  }

  cancelRide(id: string): void {
    this.rideService.cancelRide(id).subscribe(() => {
      this.rides = this.rides.filter(ride => ride._id !== id);
      this.applyFilters();
    });
  }

  assignDriver(rideId: string, driverId: string): void {
    this.rideService.assignDriver(rideId, driverId).subscribe((updatedRide) => {
      this.updateRideInList(updatedRide);
    });
  }
}
