import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignupService } from '../services/authentication/signup.service';
import { Signup } from '../shared/signup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  @ViewChild('form') formObject: NgForm
  userData: Signup = {
    name: '',
    phone:null,
    email: '',
    password:''
  }
  componentSwitch: string = '';
  redirectlogin:boolean = false
  constructor(private signupService: SignupService,
    private router: Router,
    private route:ActivatedRoute
  ){}
  onSignup(componentSwitch:string) {
    this.userData.name = this.formObject.value.name
    this.userData.phone = this.formObject.value.phone
    this.userData.email = this.formObject.value.email
    this.userData.password = this.formObject.value.password

    console.log(this.userData);
    this.signupService.postSignupData(this.userData).subscribe((response) => {
      console.log(response.status);
      
      if (response.status === 201) {
        this.redirectlogin = true
        this.componentSwitch = componentSwitch;
        setTimeout(() => {
          this.router.navigate(['/login'], {relativeTo:this.route})
          this.redirectlogin = false;
        }, 2000);
      } else {
        this.redirectlogin = false
      }
    });

  }
}
