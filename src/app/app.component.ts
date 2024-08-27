import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './services/authentication/login.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';


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
    private bnIdle:BnNgIdleService
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.bnIdle.startWatching(5).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.loginService.autoLoguot()
        this.bnIdle.stopTimer();
      }
    });
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
