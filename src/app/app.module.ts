import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { MapsComponent } from './maps/maps.component';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { SignupComponent } from './signup/signup.component';
import { RidesComponent } from './rides/rides.component';
import { UserComponent } from './user/user.component';
import { DriversComponent } from './drivers/drivers.component';
import { PricingComponent } from './pricing/pricing.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateRideComponent } from './rides/create-ride/create-ride.component';
import { ConfirmRideComponent } from './rides/confirm-ride/confirm-ride.component';
import { RideHistoryComponent } from './rides/ride-history/ride-history.component';
import { DriverListComponent } from './drivers/driver-list/driver-list.component';
import { RunningRequestComponent } from './drivers/running-request/running-request.component';
import { CountryComponent } from './pricing/country/country.component';
import { CityComponent } from './pricing/city/city.component';
import { VehicleTypeComponent } from './pricing/vehicle-type/vehicle-type.component';
import { VehiclePricingComponent } from './pricing/vehicle-pricing/vehicle-pricing.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { VehicleListComponent } from './pricing/vehicle-type/vehicle-list/vehicle-list.component';
import { CityListComponent } from './pricing/city/city-list/city-list.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapService } from './services/maps/mapsApi.service';
import { DistanceTimeService } from './services/maps/distancetime.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsLoaderService } from './services/maps/google-maps-loader.service';
import { ZonesService } from './services/maps/zones.service';
import { VehicleTypeService } from './services/vehicleType.service.ts/vehicle-type.service';
import { CountryListComponent } from './pricing/country/country-list/country-list.component';
import { CountryApiService } from './services/countryApi.service.ts/country-api.service';
import { CommonModule, LowerCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    MapsComponent,
    DashboardMenuComponent,
    SignupComponent,
    RidesComponent,
    UserComponent,
    DriversComponent,
    PricingComponent,
    SettingsComponent,
    CreateRideComponent,
    ConfirmRideComponent,
    RideHistoryComponent,
    DriverListComponent,
    RunningRequestComponent,
    CountryComponent,
    CityComponent,
    VehicleTypeComponent,
    VehiclePricingComponent,
    ErrorPageComponent,
    HomeComponent,
    VehicleListComponent,
    CityListComponent,
    CountryListComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    provideClientHydration(),
    MapService,
    provideHttpClient(
      withFetch()
    ),
    DistanceTimeService,
    GoogleMapsLoaderService,
    ZonesService,
    VehicleTypeService,
    CountryApiService,
    LowerCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
