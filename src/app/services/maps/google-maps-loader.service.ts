import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
      libraries: ['places', 'geometry', 'routes','geocoding','marker'],
    
    });
  }

  load(): Promise<any> {
    return this.loader.load();
  }
}
