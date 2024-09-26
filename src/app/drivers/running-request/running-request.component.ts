import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DriverRunningRequestService } from '../../services/runningRequest/driver-running-request.service';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';
import { TripControlServiceService } from '../../services/tripControlSerivce/trip-control-service.service';
import { response } from 'express';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-running-request',
  templateUrl: './running-request.component.html',
  styleUrls: ['./running-request.component.css']
})
export class RunningRequestComponent implements OnInit {
  assignedRequests: any[] = [];
  selectedRequest: any = null;
  timer: any = null;
  emptyBookingError: boolean = false;
  countdown: string = '';
  rideStatus: string = '';
  invoiceArray: any[] = [];
  invoiceObject: any = {}
  showInvoice: boolean = false;
  bookingId: string = '';
  currentRideStatus:string = ''
  rideCompleteStatus: boolean = false;
  nodemail: boolean = false;
  countdownTimer: number = null;
  cronDataBooking: any
  booking_id: string =''
  //constructor
  constructor(
    private requestService: DriverRunningRequestService,
    private socketService: SocketService,
    private rideService: RideService,
    private tripControlService: TripControlServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAssignedRequests();
    this.listenForAssignedRequests();
  }

  loadAssignedRequests(): void {
    this.requestService.getAssignedRequests().subscribe({
      next: (requests) => {
        console.log("assignedRequests: ",requests);
        this.emptyBookingError = false;
        this.filteredRequests(requests);
      },
      error: (error) => {
        console.error(error);
        this.emptyBookingError = true;
      }
    });
  }

  filteredRequests(requests) {
    this.assignedRequests = requests.filter((request) => {
     return (request.status !== "Completed" && request.status !== "Pending" && request.status !== "Cancelled")
    });
    this.emptyBookingError = this.assignedRequests.length === 0;
  }

  listenForAssignedRequests(): void {
    this.socketService.onConfirmedRideDriver().subscribe((ConfirmedRideDriver) => {
      console.log("Socket Response", ConfirmedRideDriver);
      this.emptyBookingError = !ConfirmedRideDriver;
      this.assignedRequests.push(ConfirmedRideDriver);
      
    });
      this.socketService.cronReassignDriver().subscribe((newDriverBooking) => {
        console.log("CRON ASSIGNED DRIVER: ", newDriverBooking)
        if (newDriverBooking) {
          this.cronDataBooking = newDriverBooking.driver
          console.log("cronDataBooking: ", this.cronDataBooking.driverArrayLength)
          
        }
      })
      // When there are no drivers found by the scheduler
    this.socketService.noDriversFoundNearBy().subscribe((response) => {
      console.log("No Drivers found")
      if (response.filteredDriverList.length === 0) {
        this.cronDataBooking = null
      this.removeRequest(response.bookingId);
      this.router.navigate(['/rides/confirm-ride'])

      }
    })
  
    //count down timer
    this.socketService.requestCountdownTimer().subscribe((countdown) => {
      this.booking_id = countdown.booking._id
      console.log("countdown: ", countdown.booking._id)
      
      this.countdownTimer = countdown.timeRemaining
      console.log(this.countdownTimer);
    })
  }

  selectRequest(request: any): void {
    this.selectedRequest = request;
    console.log("Selected request: ", request);
    
    // this.startTimer(request.requestTimer);
  }

 

  acceptRequest(request: any): void {
  console.log(request)
    this.requestService.acceptRequest(request._id).subscribe((response) => {
      console.log("ACCEPT REQUEST: ", response)
      if (response) {
        this.loadAssignedRequests();
        this.cdr.detectChanges(); // Manually trigger change detection
  //       this.socketService.emitDriverResponse(response).subscribe((response) => {
  //            console.log(response)
  // })
    }
    
  });
 

}

  cancelRequest(request: any): void {
    
    this.requestService.cancelRequestFromRideBookedCollection(request._id).subscribe((response:any) => {
      if(response)
      console.log(response);
  //      this.socketService.emitDriverResponse(response).subscribe((response) => {
  //     console.log("Socket response: ",response)
  // })
      this.removeRequest(request._id);
      this.router.navigate(['/rides/confirm-ride'])
    });
   
    // this.requestService.cancelRequestFromRidesCollection(request.bookingId).subscribe(() => {
    //   this.removeRequest(request._id);
    // });
  }

  reassignRequest(request: any): void {
    this.requestService.reassignRequest(request._id).subscribe(() => {
      this.removeRequest(request._id);
    });
  }

  removeRequest(requestId: string): void {
    this.assignedRequests = this.assignedRequests.filter(req => req._id !== requestId);
    this.selectedRequest = null;
    clearInterval(this.timer);
    this.countdown = '';
    this.emptyBookingError = this.assignedRequests.length === 0;
  }

  onChangeRideProgress(request: any, status: string): void {
    console.log("Request Object; ", request);
    const updateRequest = request;
    updateRequest.status = status;
    this.bookingId = request._id
    this.tripControlService.updateBookingStatus(updateRequest)
      .subscribe((response) => {
        this.currentRideStatus = response.body.booking.status
        console.log("Status: ", this.currentRideStatus);
        
        setTimeout(() => {
          this.currentRideStatus = ''
        }, 2500);
    //     console.log("Ride Completed response: ", response);
    //     if (status === 'Completed') {
    //        this.invoiceObject = response.body.booking
    //     // this.invoiceArray.push(this.invoiceObject);
    //     }
       
      //   if (this.invoiceObject.status === 'Completed') {
      //     this.tripControlService.calculateInvoice(this.invoiceObject.bookingId).subscribe((response) => {
      //       console.log("Invoice Response: ", response);
      //       if (response) {
      //         this.showInvoice = true;
              
      //       }
      //   })
        // }
        
        if (response.body.booking.status === 'Completed') {   
          this.showInvoice = true;
          this.rideCompleteStatus = true;
          this.invoiceObject = response.body.inovice
          this.nodemail = true;
          console.log("Inovice Object: ", this.invoiceObject);
             this.removeRequest(request._id)
          setTimeout(() => {
            this.rideCompleteStatus = false
            this.currentRideStatus = ''
            this.nodemail = false
          }, 2500);
        }
        
    })
   
  }
}
