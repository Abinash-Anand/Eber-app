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
  statusOptions: string[] = [ 'Completed', 'Cancelled'];

  constructor(private rideHistoryService: HistoryService) { }

  ngOnInit(): void {
    this.fetchRideHistory();
  }

  fetchRideHistory() {
    this.rideHistoryService.getRideHistory().subscribe(data => {
      // console.log(data);
      
      this.rideHistory = data.body.data;
      console.log(this.rideHistory);
      
    });
  }

  applyFilters() {
    // Apply filters and fetch filtered ride history
  }
  downloadCsv(ride) {
    this.downloadCSV(ride)
  }
   convertToCSV(objArray) {
    const array = Array.isArray(objArray) ? objArray : [objArray];
    const headers = Object.keys(array[0]).join(',');
    const rows = array.map(obj => Object.values(obj).join(',')).join('\n');
    return `${headers}\n${rows}`;
}

   downloadCSV(objArray, filename = 'ride.csv') {
    const csv = this.convertToCSV(objArray);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
  filterByStatus(event: Event) {
    const filter = (event.target as HTMLSelectElement).value;
    console.log("filter: ", filter);
    
    this.rideHistoryService.getFilteredRide(filter).subscribe((response) => {
      console.log(response);
      this.rideHistory =  response.body
    })
    
}

  searchRides(event: Event) {
    console.log(event);

 }


}
