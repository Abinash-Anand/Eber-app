import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SettingsService } from '../services/settings/settings.service';
import { Settings } from '../shared/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  acceptRequestTime: number = 30; // Default value or initialize as needed
  maxStops: number = 2; // Default value or initialize as needed
  settingObject: Settings = {
    id:"DEFAULT",
    requestAcceptTime: null,
    numberOfStops:null,
  };
  newSettings: boolean = false;
  DefaultSettings:boolean = false
  settingId: string = '';
  constructor(private settingsService: SettingsService) { }
  ngOnInit(): void {
    this.disableDefaultSettings()
  }

  disableDefaultSettings() {
     const id = 'DEFAULT';

    this.settingsService.getDefaultSettings().subscribe(response => {
       if (response.status === 200 && response.body && response.body.length > 0) {
        this.DefaultSettings = true;
        this.acceptRequestTime = response.body[0].requestAcceptTime
        this.maxStops  =  response.body[0].numberOfStops
        this.settingsService.settingArray[0].requestAcceptTime = response.body[0].requestAcceptTime
        this.settingsService.settingArray[0].numberOfStops =response.body[0].numberOfStops
      } else {
        this.DefaultSettings = false;
      }
      console.log("server response", response);
    });
  }

  getDefaultSettings() {
    const defaultSettings = {
      acceptRequestTime: this.acceptRequestTime,
      maxStops:this.maxStops
    }

  }
  onSelectWaitingTime(event: Event) {
    const waitingTime = event.target as HTMLSelectElement
    this.acceptRequestTime = +waitingTime.value
    console.log(this.acceptRequestTime);
    // this.settingsService.settingArray[0].requestAcceptTime = this.acceptRequestTime
   
  
  }

  onSelectStop(stop: Event) {
    const stops = stop.target as HTMLSelectElement;
    this.maxStops = +stops.value
    console.log(this.maxStops);
   
    // this.settingsService.settingArray[0].numberOfStops = this.maxStops
    
    // this.settingsService.logArray()
  }
  updateSettings() {
    this.settingObject.requestAcceptTime = this.acceptRequestTime;
    this.settingObject.numberOfStops = this.maxStops
    this.settingsService.updateDefaultSettings(this.settingObject).subscribe((newSettingResponse) => {
      if (newSettingResponse.status === 200 && newSettingResponse.body !== null) {
        this.disableDefaultSettings()
        console.log("New Settings have been added");
        this.newSettings = true
      }
      setTimeout(() => {
        this.newSettings =  false
      }, 2500);
      
    })

  }
  setDefaultSettings() {
    const   requestAcceptTime = 30
    const numberOfStops = 2;
    const defaultSettings = {
      id:"DEFAULT",
      requestAcceptTime,
      numberOfStops,
    }
    this.settingsService.postDefaultSettings(defaultSettings).subscribe((settingResponse) => {
      if (settingResponse.status === 200) {
        this.DefaultSettings = true;
        setTimeout(() => {
        alert("Settings set to Default")
      }, 1000);
      }
          
    })
    
    
  }
}
