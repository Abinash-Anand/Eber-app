import { Component, OnInit } from '@angular/core';
import { RideService } from '../../services/confirm-ride/ride.service';
import { SocketService } from '../../services/sockets/socket.service';
// import { RideService } from '../services/ride.service';
// import { SocketService } from '../services/socket.service';


@Component({
  selector: 'app-confirm-ride',
  templateUrl: './confirm-ride.component.html',
  styleUrl: './confirm-ride.component.css'
})
export class ConfirmRideComponent implements OnInit {

  rides: any[] = [];
  filteredRides: any[] = [];
  selectedRide: any = null;
  filters: any = {
    username: '',
    phone: '',
    requestId: '',
    status: ''
  };

  constructor(private rideService: RideService, private socketService: SocketService) { }

  ngOnInit(): void {
    // this.fetchRides();
    // this.setupSocketListeners();
  }

  fetchRides(): void {
    this.rideService.getConfirmedRides().subscribe((data: any) => {
      this.rides = data;
      this.applyFilters();
    });
  }

  setupSocketListeners(): void {
    this.socketService.on('rideStatusUpdate', (ride: any) => {
      const index = this.rides.findIndex(r => r.requestId === ride.requestId);
      if (index > -1) {
        this.rides[index].status = ride.status;
      }
      this.applyFilters();
    });
  }

  onFilterChange(filterKey: string, filterValue: string): void {
    this.filters[filterKey] = filterValue;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRides = this.rides.filter(ride => {
      return (!this.filters.username || ride.userName.includes(this.filters.username)) &&
             (!this.filters.phone || ride.userPhone.includes(this.filters.phone)) &&
             (!this.filters.requestId || ride.requestId.includes(this.filters.requestId)) &&
             (!this.filters.status || ride.status === this.filters.status);
    });
  }

  cancelRide(requestId: string): void {
    this.rideService.cancelRide(requestId).subscribe(() => {
      this.fetchRides();
    });
  }

  assignDriver(requestId: string): void {
    // Logic to assign driver (e.g., open a modal to select a driver)
  }

  viewRideDetails(requestId: string): void {
    this.selectedRide = this.rides.find(ride => ride.requestId === requestId);
    // Show the ride details modal
    // $('#rideDetailsModal').modal('show');
  }
}
