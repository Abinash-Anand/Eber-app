import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DriverRunningRequestService } from '../../services/runningRequest/driver-running-request.service';
import { SocketService } from '../../services/sockets/socket.service';
import { RideService } from '../../services/rides/ride.service';
import { TripControlServiceService } from '../../services/tripControlSerivce/trip-control-service.service';
import { response } from 'express';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-running-request',
  templateUrl: './running-request.component.html',
  styleUrls: ['./running-request.component.css']
})
export class RunningRequestComponent implements OnInit {
  invoiceId: string = '';
  feedbackSubmited: boolean = false
  assignedRequests: any[] = [];
  countdownTimers: { bookingId: string, countdown: number }[] = [];
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
  booking_id: string = ''
    private countdownSub: Subscription;
 userRating: number = 0;          // Stores the user's rating for the ride
  driverRating: number = 0;        // Stores the user's rating for the driver
  comments: { [key: string]: boolean } = {
    polite: false,
    timely: false,
    clean: false,
    safe: false,
    friendly: false,
  };                                // Object to hold comments
    feedbackForm: FormGroup;
     Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
  });
  commentsList = [
    { key: 'onTime', label: 'Driver arrived on time' },
    { key: 'friendly', label: 'Driver was friendly and courteous' },
    { key: 'smoothDrive', label: 'Driving was smooth and safe' },
    { key: 'trafficRules', label: 'Driver followed all traffic rules' },
    { key: 'lateArrival', label: 'Driver arrived late' }
  ];
  //constructor
  constructor(
    private requestService: DriverRunningRequestService,
    private socketService: SocketService,
    private rideService: RideService,
    private tripControlService: TripControlServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadAssignedRequests();
    this.listenForAssignedRequests();
    this.initForm()
  }
    // Initialize the reactive form
  initForm() {
    this.feedbackForm = this.fb.group({
      rideRating: [null, Validators.required],
      driverRating: [null, Validators.required],
      onTime: [false],
      friendly: [false],
      smoothDrive: [false],
      trafficRules: [false],
      lateArrival: [false]
    });
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
    
    //manual booking cancellation
    this.socketService.manualBookingCancelled().subscribe((response) => {
      if (response) {
        console.log("Manually settimeout Booking cancelled: ", response)
        this.removeRequest(response.bookingId);
        this.router.navigate(['/rides/confirm-ride'])
      }
    })
    this.socketService.onCountdownUpdate().subscribe((timerUpdate) => {
      console.log(timerUpdate)
      const { bookingId, countdown } = timerUpdate;
      this.countdownTimers[bookingId] = countdown; 
      

    })
    //count down timer
    // this.socketService.requestCountdownTimer().subscribe((countdown) => {
    //   this.booking_id = countdown.booking._id
    //   console.log("countdown: ", countdown.booking._id)
      
    //   console.log(this.countdownTimer);
    // })
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
           this.Toast.fire({
          icon: 'success',
          title: 'Invoice Sent to your Email'
        });
          console.log("Inovice Object: ", this.invoiceObject);
               this.invoiceId = this.invoiceObject._id
          console.log("Inovice iD: ", this.invoiceId)
          this.removeRequest(request._id)
          // if (response.body.transfer !== null) {
          //   window.location.href = response.body.transfer;
          // }
          setTimeout(() => {
            this.rideCompleteStatus = false
            this.currentRideStatus = ''
            this.nodemail = false
          }, 2500);
        }
        
    })
   
  }


   // Set the rating for ride or driver
  setRating(controlName: string, rating: number) {
    this.feedbackForm.get(controlName)?.setValue(rating);
  }

  // Handle form submission
  submitFeedback() {
    if (this.feedbackForm.valid) {
      const formValues = this.feedbackForm.value;
      console.log('Submitted Feedback:', formValues);
      this.tripControlService.submitFeedback(formValues, this.invoiceId).subscribe((response) => {
         Swal.fire({
        title: 'Success!',
        text: "Your Feedback is Precious for Us. Submitted successfully!",
        icon: 'success',
        confirmButtonText: 'OK'
         });
        this.feedbackSubmited = true
        // this.Toast.fire({
        //   icon: 'success',
        //   title: 'Tanks'
        // });
      })
      // Example action after submission
      // alert('Thank you for your feedback!');
      
      // Optionally reset the form
      this.feedbackForm.reset();
    } else {
      alert('Please provide all required feedback!');
    }
  }
}
