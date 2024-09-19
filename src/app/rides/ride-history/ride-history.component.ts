import { Component, ElementRef, ViewChild } from '@angular/core';
// import { HistoryService } from '../../services/ride-history/history.service';
import { MapService } from '../../services/maps/mapsApi.service';
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
  statusOptions: string[] = ['All', 'Completed', 'Cancelled' , 'Date'];
  @ViewChild('searchParams') searchParams: ElementRef
  constructor(private rideHistoryService: HistoryService,
    private mapService: MapService
  ) { }

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

  searchRides() {
    console.log(this.searchParams.nativeElement.value);
    this.rideHistoryService.getHistoryBySearch(this.searchParams.nativeElement.value)
      .subscribe((response) => {
        console.log(response);
        if (response.status === 201) {
          this.rideHistory = response.body
        }
    })

 }
dropDownMap(ride) {
    console.log("Testing Map: ", ride);
    console.log(JSON.parse(ride.fromLocation));
    
    const fromCoords = JSON.parse(ride.fromLocation); // Directly use the object
    const toCoords =JSON.parse( ride.toLocation) // Directly use the object
    
    console.log("From: ", fromCoords);
    console.log("To: ", toCoords);
    
    this.mapService.googleMapsApi(document.getElementById('map'), fromCoords, () => {}).then(map => {
        // Clear any existing markers or routes
        this.mapService.clearMarkers();

        // Add markers for the from and to locations
        this.mapService.addMarker(map, fromCoords, 'From Location', 'green');
        this.mapService.addMarker(map, toCoords, 'To Location', 'red');

        // Get directions between the from and to locations
        this.mapService.getDirections(fromCoords, toCoords).then(directions => {
            this.mapService.renderDirections(map, directions);
        }).catch(error => {
            console.error("Error getting directions: ", error);
        });
    });
}


}
