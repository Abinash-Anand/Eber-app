import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RidesComponent } from './rides/rides.component';
import path from 'path';
import { ConfirmRideComponent } from './rides/confirm-ride/confirm-ride.component';
import { CreateRideComponent } from './rides/create-ride/create-ride.component';
import { RideHistoryComponent } from './rides/ride-history/ride-history.component';
import { PricingComponent } from './pricing/pricing.component';
import { CityComponent } from './pricing/city/city.component';
import { CountryComponent } from './pricing/country/country.component';
import { VehiclePricingComponent } from './pricing/vehicle-pricing/vehicle-pricing.component';
import { VehicleTypeComponent } from './pricing/vehicle-type/vehicle-type.component';
import { DriversComponent } from './drivers/drivers.component';
// import { DriverListComponent } from './drivers/driver-list/driver-list.component';
import { RunningRequestComponent } from './drivers/running-request/running-request.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorPageComponent } from './error-page/error-page.component';
// import { HomeComponent } from './home/home.component';
import { VehicleListComponent } from './pricing/vehicle-type/vehicle-list/vehicle-list.component';
import { CityListComponent } from './pricing/city/city-list/city-list.component';
import { CountryListComponent } from './pricing/country/country-list/country-list.component';
import { UserComponent } from './user/user.component';
import { DriverListComponent } from './drivers/driver-list/driver-list.component';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  { path: 'maps', component: MapsComponent },
  { path: 'login', component: LoginComponent },
  {path:'users', component:UserComponent} ,
  { path: 'signup', component: SignupComponent },
  {path:'notification', component:NotificationsComponent},
  {
    path: 'rides', component: RidesComponent, children: [
      { path: 'confirm-ride', component: ConfirmRideComponent },
      { path: 'create-ride', component: CreateRideComponent },
      { path: 'ride-history', component: RideHistoryComponent }
    ]
  },
  {
    path: 'pricing', component: PricingComponent, children: [
      {
        path: 'city', component: CityComponent, children: [
        {path:'city-list', component:CityListComponent}
      ] },
      {
        path: 'country', component: CountryComponent, children: [
        {path:'country-list', component:CountryListComponent}
      ] },
      { path: 'vehicle-pricing', component: VehiclePricingComponent },
      {
        path: 'vehicle-type', component: VehicleTypeComponent, children: [
          {path: "vehicle-list", component:VehicleListComponent}
      ]}
    ]
  },
  {
    path: 'drivers', component: DriversComponent, children: [
      { path: 'driver-list', component: DriverListComponent },
      {path:'running-request', component:RunningRequestComponent}
    ]
  },
  { path: 'settings', component: SettingsComponent },
  
  
  //this route for all the other routes that is not included in this 
  {path:'**', component:ErrorPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
