import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../services/maps/mapsApi.service';
import {  } from '@googlemaps/js-api-loader';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef') mapElement: ElementRef
    searchText: string = '';
  suggestions: google.maps.places.QueryAutocompletePrediction[] = [];

  constructor(private mapService: MapService) {
    
  }
  ngOnInit(): void {
    this.getUserLocation()
    
  }
  ngAfterViewInit() {
    console.log(this.mapElement.nativeElement);
    
   this.mapService.googleMapsApi(this.mapElement.nativeElement)
  }

  getUserLocation() {
     this.mapService.getLocationService().then(response => {
      
       console.log(response.lng, response.lat);
        
      })
  }


  onSearchChange(search) {
    console.log(search);
    this.searchText = search
    this.mapService.getPlacePredictions(this.searchText).then(results => {
      this.suggestions = results;
    }).catch(error => {
      console.error('Error searching places:', error);
      this.suggestions = []; // Clear suggestions on error
    });
  }
}
