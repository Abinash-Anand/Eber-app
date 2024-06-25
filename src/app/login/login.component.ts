import { Component, ViewChild } from '@angular/core';
import { LoginService } from '../services/authentication/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('form') loginCreds: NgForm
  loginStatus: boolean = false;

  constructor(private loginService: LoginService,
   private router: Router,
   private route: ActivatedRoute ) { }

  onLogin() {
    console.log(this.loginCreds.value);
    const user = {
      username: this.loginCreds.value.email,
      password: this.loginCreds.value.password
    }
    this.loginService.loginUser(user).subscribe((logInResponse) => {
      console.log(logInResponse);
      if (logInResponse.status === 200) {
        this.loginService.loginStatus = true
        this.router.navigate(['/'] , {relativeTo:this.route})
      } else {
        this.loginService.loginStatus = false;
      }
      
    })
  
}

  
}
