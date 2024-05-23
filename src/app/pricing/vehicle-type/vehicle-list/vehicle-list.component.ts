import { Component, OnInit } from '@angular/core';
import { VehicleTypeService } from '../../../services/vehicleType.service.ts/vehicle-type.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicleArray: Array<{ name: string, type: string, image: string }> = [];

  constructor(private vehicleTypeService: VehicleTypeService) {}

  ngOnInit() {
    this.vehicleArray = this.vehicleTypeService.vehicleDataArray;
    console.log("this works");
  }
}
