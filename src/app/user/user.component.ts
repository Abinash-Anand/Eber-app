import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SignupService } from '../services/authentication/signup.service';
import { Signup } from '../shared/signup';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/users/user.service';
import { User } from '../shared/user';
import { CountryApiService } from '../services/countryApi.service.ts/country-api.service';
import { Country } from '../shared/country';
import { CityService } from '../services/city/city.service';
import { PaymentService } from '../services/payment/payment.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'] // Note the plural form 'styleUrls'
})
export class UserComponent implements OnInit {
  users: Signup[] = [];
  userObject: User = {
    userProfile: '',
    username: '',
    email: '',
    phone: null,
    countryCode: '',
    countryCallingCode:''
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
  cityArray: any[] = [];
  invalidEmail: boolean = false;
  searchByFilter: string = 'Search By';
  errorMessage:string=''
  selectedCountryId: string | null = null;
  filteredCityArray: any[] = [];
  countries: Country[] = [];
  cardValidity: boolean = false
  cardSaved: boolean = false
  userObjectId: string = '';
  updateUserData: {
    userProfile: string, username: string, email: string, phone: string | null, userId: string, countryCode: string
  } = {
      userProfile: '', username: '', email: '', phone: null, userId: '', countryCode: ''
    }

  user:User= {
    userProfile: '', username: '', email: '', phone: null, countryCode: '', countryCallingCode:''
  }

  searchObject: { searchBy: string, searchInput: any } = { searchBy: '', searchInput: null }

  @ViewChild('searchForm') searchFormData!: NgForm;
  @ViewChild('form') userForm!: NgForm;
  @ViewChild('form') form!: NgForm;

  constructor(
    private signupService: SignupService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private countryApiService: CountryApiService,
    private cityService: CityService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.getAllUsers();
    this.getCountries();
    this.paymentService.ngOnInit()
  }

  getCountries() {
    this.countryApiService.getAllCountries().subscribe(countries => {
      this.countries = countries;
      this.cityService.getCitiesData().subscribe(city => {
        this.cityArray = city.body;

        // Filter countries based on cityArray
        const filteredCountries = this.countries.filter(country =>
          this.cityArray.some(city => city.country === country.countryCode)
        );

        // Remove duplicates
        this.countries = filteredCountries.filter((country, index, self) =>
          index === self.findIndex((c) => c.countryCode === country.countryCode)
        );

        console.log("Filtered Countries: ", this.countries);
        this.cd.detectChanges();
      });
    });
  }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.selectedCountryId = selectedOption.value;

    this.filterCitiesByCountry();
  }

  filterCitiesByCountry() {
    if (this.selectedCountryId) {
      this.filteredCityArray = this.cityArray.filter(city => city.country === this.selectedCountryId);
      this.cd.detectChanges();
    }
  }

  onCreateUser() {
    console.log(this.userForm.value);
    const filteredArrayObject = this.countries.filter((country) => {
      return country.countryCode === this.userForm.value.countryCode
    })
    console.log("Country Object: ", filteredArrayObject);
    
    this.userObject = this.userForm.value;
    this.userObject.countryCallingCode = filteredArrayObject[0].countryCallingCode
    this.userService.createNewUser(this.userObject).subscribe(
      (response) => {
        if (response.status === 201) {
          this.getAllUsers(); // Fetch the updated user list
          this.userCreated = true;
        }
        setTimeout(() => {
          this.userCreated = false;
        }, 2500);
        console.log(response);
      },
      (error) => {
        if (error.status === 400) {
          this.invalidEmail = true;
          // setTimeout(() => {
          //   this.invalidEmail = false;
          // }, 2500);
        }
        console.error('Error creating user:', error);
      }
    );
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

  onUpdateUser() {
    console.log(this.form);
    // this.updateUserData = this.updateFormData.value

    // this.updateUserData.userId = user
    // console.log(this.updateUserData);
  
    
    // this.userService.updateUser(this.updateUserData).subscribe((response) => {
    //   console.log(response);
      
    // })
  }

  onDeleteUser(id: string) {
    console.log(id);
    this.userService.deleteUser(id).subscribe(() => {
      this.getAllUsers();
      this.userDeleted = true;
      setTimeout(() => {
        this.userDeleted = false;
      }, 2500);
    });
  }

  onSelectSearchFilter(searchFilter: string) {
    this.searchObject.searchBy = searchFilter;
    this.searchByFilter = searchFilter;
  }

  onSearchUser() {
    this.searchObject.searchInput = this.searchFormData.value.searchInput;
    console.log(this.searchObject);

    this.userService.getSpecificUser(this.searchObject).subscribe(
      (response) => {
        console.log('Search Response:', response.length);
        if (response.length !== 0) {
          
          this.user = response[0];
          console.log("USer: ", this.user);
          this.searchUser = true;
        } else {
          this.searchUser = false;
        }
      },
      (error) => {
        console.error('Error fetching specific user:', error);
      }
    );
  }

  //-------------stripe payment gateway-----------------------
 
 async handlePayment() {
  try {
    const result = await this.paymentService.handlePayment();
    (result.paymentMethod as any).userId = this.userObjectId; // Cast to any to add userId
    console.log(result); // Output the result from handlePayment

    this.paymentService.sendPaymentMethodToServer(result.paymentMethod).subscribe({
      next: (response: any) => {
        if (response.status === 500) {
          this.cardValidity = true;
        } else if (response.status === "succeeded") {
          this.cardSaved = true;
        }
        this.errorMessage = '';
        setTimeout(() => {
          this.cardSaved = false;
          this.cardValidity = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Server error:', error);
        this.errorMessage = 'An error occurred while processing your payment. Please try again.';
        setTimeout(() => {
          this.cardSaved = false;
          this.cardValidity = false;
          this.errorMessage = ''; 
        }, 3000);
      }
    });
  } catch (error) {
    console.error('Payment handling error:', error);
  }
}

  onAddPayment(user:any) {
    console.log(user._id);
    this.userObjectId = user._id
  }

  
}

