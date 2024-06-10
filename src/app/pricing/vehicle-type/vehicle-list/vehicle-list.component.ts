import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VehicleTypeService } from '../../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../../shared/vehicle';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements AfterViewInit {
  vehicleArray: Vehicle[] = [];

  constructor(private vehicleTypeService: VehicleTypeService) {}

  ngAfterViewInit() {
  
  }
  viewData() {
    this.vehicleArray = this.vehicleTypeService.vehicleDataArray;
 
  }

 
}
