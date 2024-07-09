import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './services/authentication/login.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eber-app';
  isLoggedIn: boolean = false;
  private loginStatusSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    this.loginStatusSubscription = this.loginService.loginStatus$.subscribe(status => {
      this.isLoggedIn = status;
      // if (this.isLoggedIn) {
      //   this.router.navigate(['/']);
      // }
      console.log('Login status changed:', status);
    });
  }

  stateChange() {
    this.isLoggedIn = true;
    this.checkAuth();
  }

  ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }

  logout() {
    this.loginService.logoutUser();
  }
}
