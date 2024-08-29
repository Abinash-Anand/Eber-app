import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/authentication/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit{
  loginStatus: boolean;
  constructor(private loginService:LoginService){}
  lottieOptions = {
    path:  '../../assets/icons/animation2.json'         // URL to your JSON file
  };
ngOnInit(): void {
  this.loginStatus = this.loginService.isLoggedIn
  console.log('login status: ', this.loginStatus)
}

}
