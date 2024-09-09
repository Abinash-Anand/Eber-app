import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { Vehicle } from '../../shared/vehicle';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit {
  @ViewChild('f') formElement: NgForm;
  mediaFile: File | null = null;
  carType: string = 'Select Type';
  imageSize: number = 0;
  warningText: string = "";
  formSubmit: boolean = true;
  vehicleTypeArray: { vehicleType: string }[] = []
  cars: Vehicle[] = []
  vehicleTypeAlreadyExist: boolean = false
  @ViewChild('vehicleName') vehicleType: NgForm
   @ViewChild('form') formData: NgForm;
  vehicleId: string = ''
  vehicleName: string;
  vehicleTypeId: string = ''
  formOject: { name: string, type: string }  // Initialize formOject
  constructor(private http: HttpClient, private vehicleTypeService: VehicleTypeService) {}
ngOnInit(): void {
   
}
  onSelectVehicleImg(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file.size);
      // console.log(this.mediaFile);
      
      if ((file.size / 1024)/1024 <= 1) {//check in terms of kb
        this.imageSize = (file.size / 1024) / 1024;
        this.mediaFile = file;
        console.log(this.imageSize)
      } else {
       return this.imageSize = (file.size / 1024) / 1024;
        console.log(this.imageSize)

      }
    }
  }

 onInputVehicleType() {
  this.vehicleTypeService.checkSpecificVehicleType(this.vehicleType.value).subscribe({
    next: (response) => {
      console.log(response);
      if (response.status === 200 &&
        response.body.vehicleType.toLowerCase() === this.vehicleType.value.toLowerCase() &&
        this.vehicleType.value !== '') {
        this.vehicleTypeAlreadyExist = true;
      } else {
        this.vehicleTypeAlreadyExist = false;
      }
    },
    error: (error) => {
        this.vehicleTypeAlreadyExist = false;
      console.error('Error occurred during vehicle type check:', error);
      // Handle error state here
      this.vehicleTypeAlreadyExist = false;
      // Optionally display a user-friendly message
    }
  });
}


  onSubmitVehicleType() {
    if (this.mediaFile) {
      const formData = new FormData();
      formData.append('vehicleName', this.formElement.controls.vehicleName.value);
      // formData.append('vehicleType', this.formElement.controls.carType.value);
      formData.append('vehicleImage', this.mediaFile);
      this.vehicleTypeService.submitVehicleType(formData)
        .then(response => {
          console.log('Vehicle type submitted successfully', response);
          this.formSubmit = this.formElement.pending;
          setTimeout(() => {
            this.formSubmit = true;
          }, 3000);
          this.formElement.resetForm();
          // this.carType = 'Select Type';
          this.mediaFile = null;
          this.imageSize = 0;
          this.warningText = "";
        this.getVehicleData()
        })
        .catch(error => {
          console.error('Error submitting vehicle type', error);
        });
    }
  }
  getVehicleData() {
    this.vehicleTypeService.onGetVehicle().subscribe(
      (response: any) => {
        // console.log(response.vehicles);
        this.vehicleTypeService.vehicleDataArray = response.vehicles
        this.cars = response.vehicles
        console.log(this.cars);
        
        const vehicleType  = []
        
        for (const vehicle of response.vehicles) {

          vehicleType.push(vehicle.vehicleType)
        }
        
        this.vehicleTypeArray = [...new Set(vehicleType)]
        console.log(this.vehicleTypeArray);
      },
      (error: any) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }
  

  onSelectVehicle(vehicle:any) {
    this.vehicleTypeId = vehicle._id;
  }
  
onUpdate(form: NgForm) {
  if (form.valid) {
    // Ensure formObject is initialized with the vehicle name (type) and image
    const formObject = {
      type: form.value.vehicleName,  // Use the vehicle name as the type
      image: this.mediaFile           // The image selected by the user (could be a File or base64 string)
    };

    console.log('Form obj:', formObject)
    // Perform the API call to update the vehicle details
    this.vehicleTypeService.updateVehicleDetails(this.vehicleTypeId, formObject).subscribe((response) => {
      console.log("Server Response: ", response);

      // Handle successful form submission
      setTimeout(() => {
        this.formSubmit = true;
      }, 3000);

      // Reset the form fields
      form.resetForm();
      this.carType = 'Select Type';  // Reset car type to default
      this.mediaFile = null;         // Reset file input
      this.imageSize = 0;            // Reset image size validation
      this.warningText = "";         // Clear any warning text

      // Refresh the vehicle data if necessary
      this.getVehicleData();
    }, (error) => {
      // Handle any errors from the server
      console.error('Error updating vehicle details:', error);
    });
  } else {
    // Log or display form validation errors
    console.error('Form is invalid');
  }
}

}
