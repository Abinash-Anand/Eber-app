import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings/settings.service';
import { Settings } from 'http2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  acceptRequestTime: number = 30; // Default value or initialize as needed
  maxStops: number = 2; // Default value or initialize as needed
  settingObject: Settings = {
    // requestAcceptTime: null
  }
  constructor(private settingsService: SettingsService) { }
  ngOnInit(): void {
    // this.getDefaultSettings()
  }
  getDefaultSettings() {
    const defaultSettings = {
      acceptRequestTime: this.acceptRequestTime,
      maxStops:this.maxStops
    }
    this.settingsService.settingArray[0].requestAcceptTime = defaultSettings.acceptRequestTime
    this.settingsService.settingArray[0].numberOfStops =defaultSettings.maxStops
  }
  onSelectWaitingTime(event: Event) {
    const waitingTime = event.target as HTMLSelectElement
    this.acceptRequestTime = +waitingTime.value
    console.log(this.acceptRequestTime);
    this.settingsService.settingArray[0].requestAcceptTime = this.acceptRequestTime
   
    
  }

  onSelectStop(stop: Event) {
    const stops = stop.target as HTMLSelectElement;
    this.maxStops = +stops.value
    console.log(this.maxStops);
    this.settingsService.settingArray[0].numberOfStops = this.maxStops
    console.log(this.settingsService.settingArray[0]);
    
    // this.settingsService.logArray()
  }
  
}
