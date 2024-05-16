import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environment';
import { Loader } from '@googlemaps/js-api-loader';
import { MapService } from '../services/maps/mapsApi.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements AfterViewInit {
  @ViewChild('mapRef') mapElement: ElementRef
  
  constructor(private mapService: MapService) {
    
  }
  ngAfterViewInit() {
    console.log(this.mapElement.nativeElement);
    
   this.mapService.googleMapsApi(this.mapElement.nativeElement)
  }
}
