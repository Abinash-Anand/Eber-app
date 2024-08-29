import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './services/authentication/login.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxSpinnerService } from 'ngx-spinner';


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
    private bnIdle: BnNgIdleService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.bnIdle.startWatching(1200).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.loginService.autoLoguot()
        this.bnIdle.stopTimer();
      }
    });
     /** spinner starts on init */
     this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show the spinner when navigation starts
        this.spinner.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Hide the spinner when navigation ends, is canceled, or there's an error
        this.spinner.hide();
      }
    });
  }
  lottieOptions = {
    path:  '../../assets/icons/appBackground.json'         // URL to your JSON file
  };
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
