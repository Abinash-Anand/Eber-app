import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../shared/vehicle';

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
  formSubmit: boolean = true;

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
      this.vehicleTypeService.submitVehicleType(formData)
        .then(response => {
          console.log('Vehicle type submitted successfully', response);
          this.formSubmit = this.formElement.pending;
          setTimeout(() => {
            this.formSubmit = true;
          }, 3000);
          this.formElement.resetForm();
          this.carType = 'Select Type';
          this.mediaFile = null;
          this.imageSize = 0;
          this.warningText = "";
        })
        .catch(error => {
          console.error('Error submitting vehicle type', error);
        });
    }
  }

  onSelectCarType(carType: string) {
    this.carType = carType;
  }
}
