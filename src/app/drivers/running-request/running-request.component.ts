import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DriverRunningRequestService } from '../../services/runningRequest/driver-running-request.service';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';
import { TripControlServiceService } from '../../services/tripControlSerivce/trip-control-service.service';
import { response } from 'express';

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
  constructor(
    private requestService: DriverRunningRequestService,
    private socketService: SocketService,
    private rideService: RideService,
    private tripControlService: TripControlServiceService,
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAssignedRequests();
    this.listenForAssignedRequests();
  }

  loadAssignedRequests(): void {
    this.requestService.getAssignedRequests().subscribe({
      next: (requests) => {
        this.emptyBookingError = false;
        console.log(this.assignedRequests);
        this.filteredRequests(requests);
      },
      error: (error) => {
        console.error(error);
        this.emptyBookingError = true;
      }
    });
  }

  filteredRequests(requests) {
    this.assignedRequests = requests.filter(request => request.status !== "Completed");
    this.emptyBookingError = this.assignedRequests.length === 0;
  }

  listenForAssignedRequests(): void {
    this.socketService.onConfirmedRideDriver().subscribe((ConfirmedRideDriver) => {
      console.log("Socket Response", ConfirmedRideDriver);
      this.emptyBookingError = !ConfirmedRideDriver;
      this.assignedRequests.push(ConfirmedRideDriver);
      
    });
  }

  selectRequest(request: any): void {
    this.selectedRequest = request;
    console.log("Selected request: ", request);
    
    // this.startTimer(request.requestTimer);
  }

  // startTimer(duration: number): void {
  //   if (this.timer) {
  //     clearInterval(this.timer);
  //   }
  //   let timer = duration;
  //   this.timer = setInterval(() => {
  //     let minutes = Math.floor(timer / 60);
  //     let seconds = timer % 60;

  //     this.countdown = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  //     if (--timer < 0) {
  //       this.cancelRequest(this.selectedRequest);
  //       clearInterval(this.timer);
  //     }
  //   }, 1000);
  // }

acceptRequest(request: any): void {
  this.requestService.acceptRequest(request._id).subscribe((response) => {
    this.loadAssignedRequests();
    this.cdr.detectChanges(); // Manually trigger change detection
  });
}

  cancelRequest(request: any): void {
    this.requestService.cancelRequestFromRideBookedCollection(request._id).subscribe(() => {
      this.removeRequest(request._id);
    });
    this.requestService.cancelRequestFromRidesCollection(request.bookingId).subscribe(() => {
      this.removeRequest(request._id);
    });
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
          console.log("Inovice Object: ", this.invoiceObject);
             this.removeRequest(request._id)
          setTimeout(() => {
            this.rideCompleteStatus = false
            this.currentRideStatus = ''
          }, 2500);
        }
        
    })
   
  }
}
