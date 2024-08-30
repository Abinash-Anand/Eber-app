import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/authentication/login.service';
import { SocketService } from '../services/sockets/socket.service';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrl: './dashboard-menu.component.css'
})
export class DashboardMenuComponent implements OnInit {
  logoutState: boolean = false
  timer = 20;
  hours: string = ''
  minutes: string = '';
  seconds: string = '';
  constructor(private loginService: LoginService,
    private sessionSocketService: SocketService,
    private socketService: SocketService,
  ) { }
  ngOnInit(): void {
    this.sessionSocketService.sessionCountDownTimer().subscribe((countdown) => {
      console.log(countdown);
      
    })
    console.log();
    this.listenToSessionTimer()
      
  }
  onLogout() {
    setTimeout(() => {
      this.loginService.logoutUser()
      
    }, 2000);
    this.logoutState = this.loginService.isLoggedIn
    console.log(this.logoutState);
    
    
    
  }

  listenToSessionTimer() {
    this.socketService.sessionCountDownTimer().subscribe((timer) => {
      this.hours = timer.hours
      this.minutes = timer.minutes
      this.seconds = timer.seconds
      console.log(this.minutes, this.seconds)
    })
  }
}
