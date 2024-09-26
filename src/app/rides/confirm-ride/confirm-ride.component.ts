import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';
import { DriverlistService } from '../../services/drivers/driverlist.service';
import { Ride } from '../../shared/ride';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmed-rides',
  templateUrl: './confirm-ride.component.html',
  styleUrls: ['./confirm-ride.component.css']
})
export class ConfirmRideComponent implements OnInit {
   Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
   });
    
    
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
  rideStatus: string = ''
  bookingId: string = '';
  serverRideStatus: string = '';
  constructor(private rideService: RideService,
              private socketService: SocketService,
    private driverListService: DriverlistService,
    private router: Router,
  private renderer: Renderer2) { }
    @ViewChild('myModal') myModal: ElementRef; // Access the modal using @ViewChild

  ngOnInit(): void {
    this.fetchConfirmedRides();
    this.listenForNewRides();
    this.listenForUpdatedRideStatus()
      // this.updateFilteredRides();
  }

  fetchConfirmedRides(): void {
    this.rideService.getConfirmedRides().subscribe((rides) => {
      this.rides = rides;
      this.filteredRides = rides;
    });
  }
listenForUpdatedRideStatus() {
  this.socketService.onAcceptRideRequest().subscribe((requestStatus:any) => {
    console.log('Server ride status:', requestStatus);
    if (requestStatus) {
       this.serverRideStatus = requestStatus.status;
     this.filteredRides = this.filteredRides.map((ride) => {
      if (ride._id === requestStatus._id) {
        return { ...ride, status: requestStatus.status };
       }
       

      return ride;
    });
    }
   
  });

  //when driver rejects the ride request
   this.socketService.rideRequestRejectedByDriver().subscribe((rejectedRide) => {
     this.serverRideStatus = rejectedRide.status
     this.filteredRides = this.filteredRides.map((ride) => {
      if (ride._id === rejectedRide._id) {
        return { ...ride, status: rejectedRide.status };
      }
      return ride;
    });
    })

  this.socketService.rideStatusProgressed().subscribe((newStatus: any) => {
    this.serverRideStatus = newStatus;
    console.log('NEW Status:', newStatus);

    // Use map to update the status of the ride with the matching _id
    this.filteredRides = this.filteredRides.map((ride) => {
      if (ride._id === newStatus._id) {
        return { ...ride, status: newStatus.status };
      }
      return ride;
    });

    console.log("Updated filteredRides: ", this.filteredRides);
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
    console.log("Checking Ride array: ", this.rides);
    
    this.filteredRides = this.rides.filter((ride) =>
     {
     return (ride.userId.username.toLowerCase() === query) ||
      (ride.phone === +query)  || (ride._id === query)
      }
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
      console.log(cancelledRide)
      if (cancelledRide._id) {
         Swal.fire({
        title: 'Success!',
        text: "Ride Request has been Cancelled",
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.fetchConfirmedRides();
              }else {
                this.Toast.fire({
                  icon: 'error',  
                  title: 'Something went wrong while Cancelling Ride Request'
                });
              }
            });
  }

  onAssignBooking(ride: any, status:string): void {
    this.selectedRide = ride;
    this.bookingId = ride._id
    console.log(this.bookingId);
    
    console.log("Checking: ",this.selectedRide);
    this.rideStatus = status;
    this.driverListService.getDrivers().subscribe((drivers) => {
      console.log("Driver: ", drivers);
      
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
        // Ensure the driver's status is 'approved'
        const isApproved = driver.driverObjectId.status.toLowerCase() === 'approved';
        
        // Ensure the driver's city matches the ride's pickup location
        const isCityMatch = ride.pickupLocation.includes(driver.driverObjectId.city);
      console.log("Ride: ", ride)
        // Ensure the driver's vehicle type matches the ride's vehicle type
        const isVehicleTypeMatch = driver.vehicleType === ride.serviceType;

        // All three conditions must be true
        return isApproved && isCityMatch && isVehicleTypeMatch;
    });

    console.log("Filtered drivers: ", filterDriver);
    // Do something with the filtered drivers
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
      this.selectedRide.bookingId = this.bookingId
      console.log("Checking...",this.selectedRide);
      this.selectedRide.assignmentType =  'manual'
      this.rideService.submitRideRequestData(this.selectedRide).subscribe((rideResponse) => {
        console.log(rideResponse);
        if (rideResponse.status === 201) {
     
         Swal.fire({
        title: 'Success!',
        text: "Driver Assigned to Ride Reqeust. Please wait... you'll be Redirected to Running Request ",
        icon: 'success',
        confirmButtonText: 'OK'
               });
           console.log("Assigning selected driver...");
          this.closeModal(); // Close the modal after action
            this.rideService.updateRideStatus(this.selectedRide._id, this.selectedRide).subscribe((response) => {
    this.fetchConfirmedRides();
        
      })
      console.log(this.selectedRide);
      this.driverAssigned = true;
            setTimeout(() => {
          // this.rideAccepted = false;
          this.router.navigate(['/drivers/running-request'])
        }, 3000);
        } else {
            // this.rideAccepted = true;
            this.Toast.fire({
          icon: 'error',  
          title: 'Something went wrong while assigning Driver'
      });
        }
      
        
      })
     
      
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
 
 console.log("Driver's Array: ", this.filteredDriverList);
  if (this.filteredDriverList.length > 0) {
    const randomIndex = Math.floor(Math.random() * this.filteredDriverList.length);
    console.log("Random Index: ", randomIndex);
    this.selectedRide.driver = this.filteredDriverList[randomIndex];
    this.selectedRide.status = this.rideStatus;
    this.selectedRide.bookingId = this.bookingId
    console.log("Selected Ride: ", this.selectedRide);
    this.selectedRide.assignmentType =  'auto'
    this.rideService.submitRideRequestData(this.selectedRide).subscribe((response) => {
      console.log(response);
       if (response.status === 201) {
         //  this.rideAccepted = true;
          Swal.fire({
        title: 'Success!',
        text: "Auto Assigned Driver to Ride Request. Please wait... you'll be Redirected to Running Request ",
        icon: 'success',
        confirmButtonText: 'OK'
               });
          this.closeModal(); // Close the modal after action
        } 
        setTimeout(() => {
          this.rideAccepted = false;
          this.router.navigate(['/drivers/running-request'])
        }, 3000);
         this.rideService.updateRideStatus(this.selectedRide._id, this.selectedRide).subscribe((response) => {
    this.fetchConfirmedRides();
        
      })

    })
    
      
    
  } else {
            // this.rideAccepted = true;
            this.Toast.fire({
          icon: 'error',  
          title: 'Something went wrong while Auto Assigning Driver'
      });
        }


}

  closeModal() {
    // Use Renderer2 to manipulate DOM elements
    this.renderer.removeClass(this.myModal.nativeElement, 'show');
    this.renderer.setStyle(this.myModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(document.body, 'modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      this.renderer.removeChild(document.body, backdrop);
    }
  }


  
}
