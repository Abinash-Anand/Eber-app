import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  acceptRequestTime: number = 30; // Default value or initialize as needed
  maxStops: number = 2; // Default value or initialize as needed

}
