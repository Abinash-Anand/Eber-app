import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/authentication/login.service';
import { SocketService } from '../services/sockets/socket.service';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})

export class DashboardMenuComponent implements OnInit {
  logoutState: boolean = false;
  timer = 20;
  hours: string = '';
  minutes: string = '';
  seconds: string = '';
  sessionTime: string = '';
  sessionEndingAlert: boolean = false;

  constructor(
    private loginService: LoginService,
    private sessionSocketService: SocketService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.listenToSessionTimer();
  }

  onLogout() {
    setTimeout(() => {
      this.loginService.logoutUser();
    }, 2000);
    this.loginService.sessionLogoutStopTimer().subscribe();
    this.logoutState = this.loginService.isLoggedIn;
    console.log(this.logoutState);
  }

  listenToSessionTimer() {
    this.socketService.sessionCountDownTimer().subscribe((timer) => {
      // Ensure timer values are initialized correctly
      this.hours = timer.hours ? timer.hours : '0';
      this.minutes = timer.minutes ? timer.minutes : '0';
      this.seconds = timer.seconds ? timer.seconds : '0';

      // console.log(this.minutes, this.seconds);

      // Prevent immediate logout by checking for non-zero minutes initially
      if (+this.minutes === 0 && +this.seconds === 0 && +this.hours === 0) {
        this.loginService.logoutUser();
      }
    });

    // this.socketService.sessionEnding().subscribe((response) => {
    //   console.log(response);
    //   if (response.sessionEnding === true) {
    //     this.sessionEndingAlert = true;
    //   }
    // });
  }
}
