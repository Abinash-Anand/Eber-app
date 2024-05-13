import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'maps', component: MapsComponent },
  { path: 'login', component: LoginComponent },
  {path:'signup', component:SignupComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
