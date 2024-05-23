import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css'] // Fixed typo here
})
export class VehicleTypeComponent {


  constructor(private vehicleTypeService:VehicleTypeService) {
    
  }
  @ViewChild('f') formElement: NgForm;
  mediaFile: File | null = null;
  // vehicleDataArray: Array<{ name: string, type: string, image: string }> = [];
  carType: string = 'Select Type';
  imageSize: number = 0;
  warningText: string = "";

  onSelectVehicleImg(files: FileList | null) {
    if (files && files.length > 0) {
        const file = files[0];
        this.mediaFile = file;
        // console.log("Selected file:", this.mediaFile);
        if ((this.mediaFile.size / 1024) > 1024) {
            this.imageSize = (this.mediaFile.size / 1024) / 1024;
        } else {
            this.imageSize = 0;
        }
    }
  }

  onSubmitVehicleType() {
    // console.log('Form Submitted!', this.formElement);
    // console.log('Selected file:', this.mediaFile);
    // console.log(this.formElement.controls.value);
    
    if (this.mediaFile) {
      
      this.vehicleTypeService.convertFileToBase64(this.mediaFile).then(base64 => {
        const vehicleName = this.formElement.controls.vehicleName.value;
        const vehicleData = {
          name: vehicleName,
          type:  this.formElement.controls.carType.value,
          image: base64
        };
        this.vehicleTypeService.vehicleDataArray.push(vehicleData); // Added missing push to array
        // Reset the form and variables
        this.formElement.resetForm();
        this.carType = 'Select Type';
        this.mediaFile = null;
        this.imageSize = 0;
        this.warningText = "";
        // console.log('Vehicle Data Array:', this.vehicleTypeService.vehicleDataArray);
      });
    }

  }

  onSelectCarType(carType: string) {
    this.carType = carType;
  }


}
