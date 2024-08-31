import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './services/authentication/login.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../environment';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SocketService } from './services/sockets/socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eber-app';
  isLoggedIn: boolean = false;
  sessionTime:string =''
  readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;

  private loginStatusSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private bnIdle: BnNgIdleService,
    private spinner: NgxSpinnerService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    // private socketService:SocketService
  ) {this.swUpdate.checkForUpdate()}

  ngOnInit() {
    this.swPush.messages.subscribe((message:any) => {
      console.log("Message: ", message)
    })
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
  // sessionAutoLogout() {
  //   this.socketService.sessionCountDownTimer().subscribe((timer) => {
  //     if (timer) {
  //          this.sessionTime = timer.minutes;
  //     if (+this.sessionTime === 0) {
  //       this.logout()
  //     }
  //     }
   
  //   })
  // }
}
