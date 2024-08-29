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

  constructor(private loginService: LoginService,
    private sessionSocketService: SocketService,
  ) { }
  ngOnInit(): void {
    this.sessionSocketService.sessionCountDownTimer().subscribe((countdown) => {
      console.log(countdown);
      
    })
    console.log();
    
      
  }
  onLogout() {
    setTimeout(() => {
      this.loginService.logoutUser()
      
    }, 2000);
    this.logoutState = this.loginService.isLoggedIn
    console.log(this.logoutState);
    
    
    
  }
}
