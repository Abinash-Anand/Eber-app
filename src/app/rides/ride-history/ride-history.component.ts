import { Component } from '@angular/core';
import { HistoryService } from '../../services/ride-history/history.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrl: './ride-history.component.css'
})
export class RideHistoryComponent {
displayedColumns: string[] = ['tripId', 'pickupLocation', 'dropOffLocation', 'status', 'date', 'actions'];
  rideHistory: any[] = [];
  filters: any = {};

  constructor(private rideHistoryService: HistoryService) { }

  ngOnInit(): void {
    this.fetchRideHistory();
  }

  fetchRideHistory() {
    this.rideHistoryService.getRideHistory().subscribe(data => {
      this.rideHistory = data;
    });
  }

  applyFilters() {
    // Apply filters and fetch filtered ride history
  }

  exportToCSV() {
    this.rideHistoryService.exportRideHistoryToCSV(this.filters).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ride-history.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

}
