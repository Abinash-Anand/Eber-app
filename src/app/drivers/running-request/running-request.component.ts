import { Component, OnInit } from '@angular/core';
import { DriverRunningRequestService } from '../../services/runningRequest/driver-running-request.service';
import { SocketService } from '../../services/sockets/socket.service';

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

  constructor(private requestService: DriverRunningRequestService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.loadAssignedRequests();
    this.listenForAssignedRequests();
  }

  loadAssignedRequests(): void {
    this.requestService.getAssignedRequests().subscribe({
      next: (requests) => {
        this.emptyBookingError = false;
        this.assignedRequests = requests;
      },
      error: (error) => {
        console.error(error);
        this.emptyBookingError = true;
      }
    });
  }

  listenForAssignedRequests(): void {
    this.socketService.onConfirmedRideDriver().subscribe((ConfirmedRideDriver) => {
      this.assignedRequests.push(ConfirmedRideDriver);
      console.log("Socket Response", ConfirmedRideDriver);
    });
  }

  selectRequest(request: any): void {
    this.selectedRequest = request;
    this.startTimer(request.requestTimer);
  }

  startTimer(duration: number): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    let timer = duration;
    this.timer = setInterval(() => {
      let minutes = Math.floor(timer / 60);
      let seconds = timer % 60;

      this.countdown = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

      if (--timer < 0) {
        this.cancelRequest(this.selectedRequest);
        clearInterval(this.timer);
      }
    }, 1000);
  }

  acceptRequest(request: any): void {
    this.requestService.acceptRequest(request._id).subscribe(() => {
      this.removeRequest(request._id);
    });
  }

  cancelRequest(request: any): void {
    console.log("Request Object: ", request);
    
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
  }
}
