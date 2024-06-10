import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../shared/vehicle';
// import { VehicleTypeService } from '../../services/vehicle-type.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent {
  @ViewChild('f') formElement: NgForm;
  mediaFile: File | null = null;
  carType: string = 'Select Type';
  imageSize: number = 0;
  warningText: string = "";
    vehicleObject: {
        name: "",
        type: '',
        path:''
  } 
  //  vehicles: Vehicle[] = []; 
  constructor(private http: HttpClient, private vehicleTypeService: VehicleTypeService) {}

  onSelectVehicleImg(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      this.mediaFile = file;
      if ((this.mediaFile.size / 1024) > 1024) {
        this.imageSize = (this.mediaFile.size / 1024) / 1024;
      } else {
        this.imageSize = 0;
      }
    }
  }

  onSubmitVehicleType() {
    if (this.mediaFile) {
      const formData = new FormData();
      formData.append('vehicleName', this.formElement.controls.vehicleName.value);
      formData.append('vehicleType', this.formElement.controls.carType.value);
      formData.append('vehicleImage', this.mediaFile);
      // this.vehicleTypeService.vehicleDataArray.push()
      this.http.post('http://localhost:5000/submit-vehicle-type', formData).subscribe(
        response => {
          console.log('Vehicle type submitted successfully', response);
          this.formElement.resetForm();
          this.carType = 'Select Type';
          this.mediaFile = null;
          this.imageSize = 0;
          this.warningText = "";
        },
        error => {
          console.error('Error submitting vehicle type', error);
        }
      );
    }
  }

  onGetVehicle() {
    this.vehicleTypeService.onGetVehicle().subscribe(
      (response: any) => {
        // Access the 'vehicles' array with image URLs from the response
        this.vehicleTypeService.vehicleDataArray = response.vehicles;
        console.log("Vehicle array: ",this.vehicleTypeService.vehicleDataArray); // Check the array in the console
      },
      (error: any) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  } 

  onSelectCarType(carType: string) {
    this.carType = carType;
  }
}
