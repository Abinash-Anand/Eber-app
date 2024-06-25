import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/authentication/signup.service';
import { Signup } from '../shared/signup';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users: Signup[] = []
  constructor(private signupService: SignupService){}
  ngOnInit(): void {
    this.signupService.getAllUsers().subscribe((usersList) => {
        console.log(usersList);
      // for (const user in usersList) {
      //   this.users.push(user);
      //   }
      })
  }
}
