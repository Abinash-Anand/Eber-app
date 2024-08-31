import { AfterViewInit, Component, Output, ViewChild } from '@angular/core';
import { LoginService } from '../services/authentication/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
// import { setInterval } from 'timers/promises';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('form') loginCreds: NgForm;
  @Output() loginEvent = new EventEmitter<boolean>();
   minTimer =  20.0;
  secondsTimer = 0.1;
  componentSwitch:string =''
  login: boolean = false;
  wrongCredentials: boolean = false;
  expiredSession: string = 'Your Session Expired';
  tokenExpired: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    if (this.login) {
      // this.countDownTimer()
    }
  }

  onLogin() {
    console.log(this.loginCreds.value);
    const user = {
      username: this.loginCreds.value.email,
      password: this.loginCreds.value.password
    };

    this.loginService.loginUser(user).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {
          const token = response.body.token; // Adjust based on your backend response
          localStorage.setItem('token', token);
          this.login = true;
          this.loginEvent.emit(this.login);
          this.loginService.setLoginStatus(true); // Notify login service about the successful login
          this.router.navigate(['/']); // Redirect to dashboard
          // this.countDownTimer()
          // setTimeout(() => {
          //   this.autoExpireSession()
          // }, 60000);
        }
      },
      error: (error) => {
        console.error(error);
        if (error.status === 401) {
          this.wrongCredentials = true;
          this.login = false;
        } else {
          console.error('Login failed due to an unexpected error.');
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    });
  }
  countDownTimer() {
    setInterval(() => {
      this.minTimer =Number(( this.minTimer - this.secondsTimer).toFixed(1))
      console.log(this.minTimer);
      
    },2000)
  }
  autoExpireSession() {
    this.loginService.autoLoguot()
  }
  onRegister(componentSwitch: string) {
    
    this.componentSwitch = componentSwitch;

  }
}
