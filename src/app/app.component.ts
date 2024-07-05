import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './services/authentication/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eber-app';
  isLoggedIn: boolean = false;
  private loginStatusSubscription: Subscription;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginStatusSubscription = this.loginService.loginStatus$.subscribe(status => {
      this.isLoggedIn = status;
      console.log('Login status changed:', status);
    });
  }

  ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }

  logout() {
    this.loginService.logoutUser();
  }
}
