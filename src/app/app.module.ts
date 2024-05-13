import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

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
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
