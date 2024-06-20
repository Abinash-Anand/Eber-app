import { AfterViewInit, Component } from '@angular/core';
import { CityService } from '../../../services/city/city.service';
import { Zone } from 'zone.js/lib/zone-impl';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
})
export class CityListComponent implements AfterViewInit {
  allCitiesList:Zone[]  = []

  constructor(private cityService: CityService) { }
  ngAfterViewInit(): void {
      this.allCitiesList = this.cityService.allCitiesList
  }
}
