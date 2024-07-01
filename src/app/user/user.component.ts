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
  };
  userList: any[] = [];
  sortType: string = 'Sort By';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  userDeleted: boolean = false;
  userUpdated: boolean = false;
  userCreated: boolean = false;
  searchUser: boolean = false;
  searchByFilter:string ='Search By'
  updateUserData: {
    userProfile: string, username: string, email: string, phone: string, userId: string, countryCode: string,
  } ={
      userProfile: '', username: '', email: '', phone: null, userId:'',countryCode:''
    }
  user: { userProfile: string, username: string, email: string, phone: string, countryCode: string } = {
     userProfile: '', username: '', email: '', phone: '', countryCode: '' 
  }
  searchObject: {searchBy: string, searchInput:string}={searchBy:'', searchInput:''}
  @ViewChild('searchForm') searchFormData: NgForm
  @ViewChild('form') userForm: NgForm;
  @ViewChild('updateForm') updateFormData: NgForm

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
    if (users.status === 201) {
      this.getAllUsers(); // Fetch the updated user list
      this.userCreated =true
        
      }
      setTimeout(() => {
        this.userCreated = false;
      }, 2500);
      console.log(users);
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

  onUpdateUser(user) {
    console.log(this.updateFormData);
    // this.updateUserData = this.updateFormData.value

    // this.updateUserData.userId = user
    // console.log(this.updateUserData);
  
    
    // this.userService.updateUser(this.updateUserData).subscribe((response) => {
    //   console.log(response);
      
    // })
  }
  onDeleteUser(id: string) {
    console.log(id);
    this.userService.deleteUser(id).subscribe();
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe((response) => {
      console.log(response);
      if (response) {
        this.userList = response.users;
        this.userDeleted = true
      }
      setTimeout(() => {
        this.userDeleted = false
      }, 2500);

    })
  }
  onSelectSearchFilter(searchFilter:string) {
    this.searchObject.searchBy = searchFilter
     this.searchByFilter = searchFilter
  }

onSearchUser() {
    this.searchObject.searchInput = this.searchFormData.value.searchInput;
    console.log(this.searchObject);

    this.userService.getSpecificUser(this.searchObject).subscribe(
      (response) => {
        console.log('Search Response:', response.length);
        this.user.userProfile = response[0].userProfile
        this.user.username = response[0].username
        this.user.email = response[0].email
        this.user.phone = response[0].phone
        this.user.countryCode = response[0].countryCode
        if (response.length !== 0) {
          this.searchUser = true;
        } else {
          this.searchUser = false
        }

      },
      (error) => {
        console.error('Error fetching specific user:', error);
      }
    );
  }

}
