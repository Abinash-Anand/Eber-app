import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.css'
})
export class DriverListComponent {
  @ViewChild('form') formData: NgForm
  constructor() {}

  onSubmitForm() {
    console.log(this.formData.value);
    
   }
  
}
