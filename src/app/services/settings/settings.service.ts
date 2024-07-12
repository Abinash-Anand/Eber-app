import { Injectable } from '@angular/core';
import { Settings } from '../../shared/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
settingArray:[Settings]
  constructor() { 
    this.settingArray = [{ requestAcceptTime: 30, numberOfStops: 2 }];
  }
  logArray() {
  console.log(this.settingArray);
  
}

}
