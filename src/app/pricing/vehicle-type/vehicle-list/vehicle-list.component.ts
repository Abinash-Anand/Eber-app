import { Component, ViewChild } from '@angular/core';
import { VehicleTypeService } from '../../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../../shared/vehicle';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
  // vehicleArray: Vehicle[] = [];
  // @ViewChild('form') formData: NgForm;
  // // carType: string;
  // mediaFile: File | null = null;
  // carType: string = 'Select Type';
  // vehicleId: string = ''
  // imageSize: number = 0;
  // warningText: string = "";
  // formSubmit: boolean = true;
  // vehicleName: string;
  // formOject: { name: string, type: string }  // Initialize formOject
  // constructor(private vehicleTypeService: VehicleTypeService) { }
  
  //   onSelectVehicleImage(files: FileList | null) {
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     this.mediaFile = file;
  //     if ((this.mediaFile.size / 1024) > 1024) {
  //       this.imageSize = (this.mediaFile.size / 1024) / 1024;
  //     } else {
  //       this.imageSize = 0;
  //     }
  //   }
  // }


  // getVehicleData() {
  //   this.vehicleTypeService.onGetVehicle().subscribe(
  //     (response: any) => {
  //       // Access the 'vehicles' array with image URLs from the response
  //       this.vehicleTypeService.vehicleDataArray = response.vehicles;
  //       this.vehicleArray = this.vehicleTypeService.vehicleDataArray;
  //       console.log("Vehicle array: ", this.vehicleTypeService.vehicleDataArray); // Check the array in the console
  //     },
  //     (error: any) => {
  //       console.error('Error fetching vehicles:', error);
  //     }
  //   );
  // }
  
  // onSelectCarType(carType: string) {
  //   this.carType = carType;
    
  // }
  // onSelectVehicle(vehicle) {
  //   this.vehicleId = vehicle._id
  //   console.log(this.vehicleId);
    
  // }
  // // onUpdate() {
  // //   if (this.formData.valid) {

  // //     // Ensure formOject is initialized
  // //     this.formOject = {
  // //       name: this.formData.value.vehicleName,
  // //       type: this.carType,
  // //     };
  // //     // this.vehicleTypeService.updateVehicleDetails(this.vehicleId, this.formOject).subscribe((result) => {
  // //     //   console.log(result);
  // //     // })
    
      
  // //     // this.vehicleTypeService.updateVehicleDetails(this.vehicleId, this.formOject).subscribe((response) => {
  // //     //   console.log("Server Response: ", response);
  // //     //   setTimeout(() => {
  // //     //       this.formSubmit = true;
  // //     //     }, 3000);
  // //     //   this.formSubmit = this.formData.pending
  // //     //   this.getVehicleData()

  // //     //      this.formData.resetForm();
  // //     //     this.carType = 'Select Type';
  // //     //     this.mediaFile = null;
  // //     //     this.imageSize = 0;
  // //     //     this.warningText = "";
        
  // //     // })
      
  // //     // // You can now use formObject to send the data to your server
  // //   } else {
  // //     console.error('Form is invalid');
  // //   }
  // // }

  // onSelectVehicleImg(event){}
}
