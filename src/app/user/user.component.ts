import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SignupService } from '../services/authentication/signup.service';
import { Signup } from '../shared/signup';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/users/user.service';
import { User } from '../shared/user';
import { CountryApiService } from '../services/countryApi.service.ts/country-api.service';
import { Country } from '../shared/country';
import { CityService } from '../services/city/city.service';
import { PaymentService } from '../services/payment/payment.service';
// Import SweetAlert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'], // Note the plural form 'styleUrls'
    encapsulation: ViewEncapsulation.Emulated // This will apply the styles globally

})
export class UserComponent implements OnInit {
  autoFillUser: any = {};
  countryObjectId: string = '';
  users: Signup[] = [];
  userObject: User = {
    userProfile: '',
    username: '',
    email: '',
    phone: null,
    countryCode: '',
    countryCallingCode:''
  };
  cardList:any[] = []
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
  userId: string = '';
  countryCode: string = '';
  Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
  });
  
  //===================

  sortBy: string = '';
  sortUsingParam: string = '';
  orderBy: string = 'Order By';
  updateUserData: {
    userProfile: string, username: string, email: string, phone: string | null, userId: string, countryCode: string
  } = {
      userProfile: '', username: '', email: '', phone: null, userId: '', countryCode: ''
    }

  user : User = {
    userProfile: '', username: '', email: '', phone: null, countryCode: '', countryCallingCode:''
  }

  searchObject: { searchBy: string, searchInput: any } = { searchBy: '', searchInput: null }

  @ViewChild('searchForm') searchFormData!: NgForm;
  @ViewChild('form') userForm!: NgForm;
  @ViewChild('updateForm') form!: NgForm;

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
    // console.log("ID: ", selectedOption.id)
    this.countryObjectId = selectedOption.id
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
    const userObject:any = this.userObject;
    userObject.countryObjectId =  this.countryObjectId
    this.userService.createNewUser(userObject).subscribe(
      (response) => {
        if (response.status === 201) {
            Swal.fire({
        title: 'Success!',
        text: 'New User Account Created Successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
});
          this.getAllUsers(); // Fetch the updated user list
          this.invalidEmail = false;
        }
        // setTimeout(() => {
        //   this.userCreated = false;
        // }, 2500);
        console.log(response);
      },
      (error) => {
        
      
        if (error.status === 400) {
          this.invalidEmail = true;
          
          // setTimeout(() => {
          //   this.invalidEmail = false;
          // }, 2500);
        } else {
            this.Toast.fire({
             icon: 'error',  
          title: 'Something went wrong.'
            })
          
        }
        // console.error('Error creating user:', error);
      }
    );
  }

  getAllUsers() {
    this.userService.getAllUsers(this.currentPage, this.pageSize, this.sortUsingParam, this.sortBy).subscribe((response) => {
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


  //==========================================Server Sorting the table======================
  orderTableBy(orderBy: string) {
    this.sortBy = orderBy
    this.orderBy = orderBy
    
  }
  serverHandledSorting(sortParam: string) {
    this.sortType = sortParam
    this.sortUsingParam = sortParam
    this.userService.sortAllUsers(this.currentPage, this.pageSize, this.sortUsingParam, this.sortBy)
      .subscribe((response) => {
        if (response.status === 200) {
          console.log('Sorted table: ', response)
          // this.userList = null;
          this.userList = response.body.users
        }
      })
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getAllUsers();
    }
  }
  onEditUser(user) {
    this.userId = user._id
    this.countryCode = user.countryCode
    this.autoFillUser = user
  }
  onUpdateUser() {
    console.log(this.form);

    this.updateUserData = this.form.value
    this.updateUserData.userId = this.userId
    this.updateUserData.countryCode = this.countryCode
    this.userService.updateUser(this.updateUserData).subscribe((response) => {
      console.log(response);
      if (response.status === 202) {
        // Example of showing an alert
        Swal.fire({
        title: 'Success!',
        text: 'User Credentials Updated Successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
});

      } else {
        Swal.fire({
        title: 'Error!',
        text: 'Something went wrong.',
        icon: 'error',
      confirmButtonText: 'Retry'
});
      }
    })
  }

  onDeleteUser(id: string) {
    console.log(id);
    this.userService.deleteUser(id).subscribe((response) => {
      if (response.status === 200) {
         this.Toast.fire({
          icon: 'success',  
          title: 'User Deleted!'
        });
      this.getAllUsers();
      // this.userDeleted = true;
      // setTimeout(() => {
      //   this.userDeleted = false;
      // }, 2500);
      } else {
        this.Toast.fire({
          icon: 'error',  
          title: 'Something went wrong!'
        });
      }
     
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
        console.log('Search Response:', response);
        if (response.status === 200) {
          this.user = response.body;
          console.log("user ", this.user)
          // console.log("USer: ", this.user);
          this.searchUser = true;
          this.userList = this.userList.filter((user) => {
            return user._id === response.body._id
          })
        // Example of showing an alert
        this.Toast.fire({
          icon: 'success',  
          title: 'User Found!'
        });
        } 
        else  { 
          console.log("error")
        this.searchUser = false;
       
      }
      },
      (error) => {
         this.Toast.fire({
          icon: 'error',
          title: 'User Not Found'
});
        console.error('Error fetching specific user:', error);
      }
    );
  }

  //-------------stripe payment gateway-----------------------
  
  onMakeDefaultCard(card, defaultCard: boolean, index) {
  console.log(card);
  const cardPayload = { ...card, defaultCard }; // Create a new payload with updated defaultCard status

  // Show the loading spinner
  Swal.fire({
    title: 'Please wait...',
    text: 'Updating your card to default',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // Update the default card status
  this.paymentService.updateDefaultCardStatus(cardPayload).subscribe((response) => {
    if (response.status === 201) {
      // Fetch updated cards after updating
      this.paymentService.fetchUserSpecificCards(card.userId).subscribe((response) => {
        Swal.close(); // Close the spinner

        if (response.status === 200) {
          this.cardList = response.body;
          this.Toast.fire({
            icon: 'success',
            title: 'Card set to Default!'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Failed to fetch updated card list!'
          });
        }
      }, error => {
        Swal.close(); // Close the spinner on error
        this.Toast.fire({
          icon: 'error',
          title: 'Failed to fetch updated card list!'
        });
        console.error('Error fetching updated card list:', error);
      });
    } else {
      Swal.close(); // Close the spinner on error
      this.Toast.fire({
        icon: 'error',
        title: 'Failed to set Default Card!'
      });
    }
  }, error => {
    Swal.close(); // Close the spinner on error
    this.Toast.fire({
      icon: 'error',
      title: 'Failed to set Default Card!'
    });
    console.error('Error updating default card status:', error);
  });
}


  onDeleteCard(card, index) {
    console.log(card._id)
    this.paymentService.deleteCard(card._id).subscribe((card) => {
      if (card.status === 200) {
        this.cardList.splice(index, 1);
      }
    })
}


 async handlePayment() {
   try {

    
    const result = await this.paymentService.handlePayment();
    (result.paymentMethod as any).userId = this.userObjectId; // Cast to any to add userId
    console.log(result); // Output the result from handlePayment

    this.paymentService.sendPaymentMethodToServer(result.paymentMethod).subscribe({
      next: (response: any) => {
        
               Swal.fire({
        title: 'Success!',
        text: "User's Card Details Added Successfully! ",
        icon: 'success',
        confirmButtonText: 'OK'
               });
        this.paymentService.fetchUserSpecificCards(this.userObjectId).subscribe((cards) => {
          if (cards.status == 200) {
            this.cardList = null;
            this.cardList = cards.body 
          }
        })
        if (!response ) {
           this.Toast.fire({
          icon: 'error',  
          title: 'Something went wrong!'
        });
          this.cardValidity = true;
        } 
        this.errorMessage = '';
        // setTimeout(() => {
        //   this.cardSaved = false;
        //   this.cardValidity = false;
        // }, 3000);
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
    this.paymentService.fetchUserSpecificCards(user._id).subscribe((cards) => {
      console.log(cards);
      this.cardList = cards.body
    })
  }

  
}

