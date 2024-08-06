import { Component, OnInit } from '@angular/core';
import { DriverRunningRequestService } from '../../services/runningRequest/driver-running-request.service';

@Component({
  selector: 'app-running-request',
  templateUrl: './running-request.component.html',
  styleUrl: './running-request.component.css'
})
export class RunningRequestComponent implements OnInit{
 assignedRequests: any[] = [];
  selectedRequest: any = null;
  timer: any = null;

  constructor(private requestService: DriverRunningRequestService) { }

  ngOnInit(): void {
    this.loadAssignedRequests();
    this.listenForAssignedRequests();
  }

  loadAssignedRequests(): void {
    this.requestService.getAssignedRequests().subscribe((requests) => {
      this.assignedRequests = requests;
    });
  }

  listenForAssignedRequests(): void {
    this.requestService.onAssignedRequest().subscribe((request) => {
      this.assignedRequests.push(request);
    });
  }

  selectRequest(request: any): void {
    this.selectedRequest = request;
    this.startTimer();
  }

  startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setTimeout(() => {
      this.cancelRequest(this.selectedRequest);
    }, 60000); // 1 minute timer
  }

  acceptRequest(request: any): void {
    this.requestService.acceptRequest(request._id).subscribe(() => {
      this.removeRequest(request._id);
    });
  }

  cancelRequest(request: any): void {
    this.requestService.cancelRequest(request._id).subscribe(() => {
      this.removeRequest(request._id);
    });
  }

  removeRequest(requestId: string): void {
    this.assignedRequests = this.assignedRequests.filter(req => req._id !== requestId);
    this.selectedRequest = null;
    clearTimeout(this.timer);
  }
}
