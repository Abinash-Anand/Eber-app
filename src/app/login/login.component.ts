import { Component, ViewChild } from '@angular/core';
import { LoginService } from '../services/authentication/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('form') loginCreds: NgForm;
  login: boolean = false;
  wrongCredentials: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
          this.login = true;
          this.loginService.setLoginStatus(true); // Update login status
          setTimeout(() => {
            this.router.navigate(['/'], { relativeTo: this.route });
          }, 2500);
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
  logoutUser() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
  console.log("session expired");
  this.loginService.setLoginStatus(false); // Update login status
}

}
