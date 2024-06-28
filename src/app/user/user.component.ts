import { Component, OnInit, ViewChild } from '@angular/core';
import { SignupService } from '../services/authentication/signup.service';
import { Signup } from '../shared/signup';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/users/user.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users: Signup[] = [];
  userObject: User = {
    userProfile: '',
    username: '',
    email: '',
    phone: '',
    countryCode: '',
    // createdAt: '' // Make sure this field is present
  };
  userList: any[] = [];
  sortType: string = 'Sort By';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  @ViewChild('form') userForm: NgForm;

  constructor(
    private signupService: SignupService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  onCreateUser() {
    this.userObject = this.userForm.value;
    this.userService.createNewUser(this.userObject).subscribe((users) => {
      console.log(users);
      this.getAllUsers(); // Fetch the updated user list
    });
  }

  getAllUsers() {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe((response) => {
      this.totalPages = response.totalPages;
      this.userList = response.users;
      console.log(response);
    });
  }

  onSortTable(sort: string) {
    if (sort === 'date') {
      this.sortUsersByTimestamp();
      this.sortType = sort;
    } else if (sort === 'ascending') {
      this.sortUsersByUsernameAscending();
      this.sortType = sort;
    } else if (sort === 'descending') {
      this.sortUsersByUsernameDescending();
      this.sortType = sort;
    }
  }

  sortUsersByTimestamp() {
    this.userList.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  }

  sortUsersByUsernameAscending() {
    this.userList.sort((a, b) => a.username.localeCompare(b.username));
  }

  sortUsersByUsernameDescending() {
    this.userList.sort((a, b) => b.username.localeCompare(a.username));
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getAllUsers();
    }
  }
}
