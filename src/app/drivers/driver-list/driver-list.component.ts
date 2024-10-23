import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SignupService } from '../../services/authentication/signup.service';
import { UserService } from '../../services/users/user.service';
import { Signup } from '../../shared/signup';
import { User } from '../../shared/user';
import { DriverlistService } from '../../services/drivers/driverlist.service';
import { Country } from '../../shared/country';
import { CountryApiService } from '../../services/countryApi.service.ts/country-api.service';
import { CityService } from '../../services/city/city.service';
import { RideService } from '../../services/rides/ride.service';
import { VehicleTypeService } from '../../services/vehicleType.service.ts/vehicle-type.service';
import { VehiclePricingService } from '../../services/pricing/vehicle-pricing.service';
import { AssignedDriverBooking } from '../../shared/assigned-driver-booking';
import { AssignVehicle } from '../../shared/assign-vehicle';
import { Pricing } from '../../shared/pricing';
import { Vehicle } from '../../shared/vehicle';
import { BankAccountService } from '../../services/driverBankAccount/bank-account.service';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.css'
})
export class DriverListComponent implements OnInit {
  ipAddress: any
  countryObjectId: string = '';
  driverCreated: boolean = false;
  @ViewChild('form') formData: NgForm;
  @ViewChild('updateForm') updateForm: NgForm;
  users: Signup[] = [];
  sortBy: string = '';
  userObject: any = {
    userProfile: '',
    username: '',
    email: '',
    phone: '',
    countryCode: '',
    city: ''
  };
  assignedServiceToDriver:any
  @ViewChild('selectedBooking') selectedBooking: ElementRef
  // filteredCityService: any[] = [];
  confirmedRides: any[] = []
  toggleActivityStatus: boolean = false;
  toggleStatus: boolean = false;
  userList: any[] = [];
  driverAssignedVehicleObject: AssignVehicle;
  sortType: string = 'Sort By';
  pricingDataArray: Pricing[] = [];
  vehicleDataArray: Vehicle[] = [];
  combinedPricingAndVehicleObject: any[]=[]
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  userDeleted: boolean = false;
  userUpdated: boolean = false;
  userCreated: boolean = false;
  searchUser: boolean = false;
  searchByFilter: string = 'Search By';
  driverObjectAssigned: AssignedDriverBooking;
  cityArray = [];
  driverStatusArray: any[] = [];
  filteredRidesByCity: any[] = []
  driverObjectId: string = '';
  driverStatus: string = 'Status';
  countries: Country[] = [];
  selectedCountryId: string | null = null;
  selectedCityId: string | null = null; // To store the selected city's ID
  driverIndex: string = null;
  filteredCityArray = []; // Array to hold filtered cities
  driverObjectIncludeVehicle: any[] = [];
  // sortParams: {sortBy, sortOrder} = {sortBy:'', sortOrder:''};
  sortOder: string = '';
  descriptions: any[] = ['Earnings Deposit Account',
    'Fuel Reimbursement Account', 'Maintenance Cost Payout',
    'Incentives and Bonuses Account', 'Ride Cancellations Refund']
  bankAccountCreated:boolean = false
  updateUserData: {
    userProfile: string, username: string, email: string, phone: string, userId: string,
    countryCode: string, city: string
  } = {
      userProfile: '', username: '', email: '',
      phone: null, userId: '', countryCode: '', city: ''
    }
  user: { userProfile: string, username: string, email: string, phone: number, countryCode: string, city: '' } = {
    userProfile: '', username: '', email: '', phone: null, countryCode: '', city: ''
  }
  serviceAssignedCheck: any;
  driverIndexId: string = '';
  searchObject: { searchBy: string, searchInput: string } = { searchBy: '', searchInput: '' }
  driverId: any;
  @ViewChild('searchForm') searchFormData: NgForm;
  @ViewChild('form') userForm: NgForm;
  @ViewChild('form') form: NgForm;
  bankAccountForm: FormGroup;
    accountUpdateForm: FormGroup
  constructor(
    private driverListService: DriverlistService,
    private countryApiService: CountryApiService,
    private cityService: CityService,
    private cd: ChangeDetectorRef,
    private rideService: RideService,
    private VehiclePricingService: VehiclePricingService,
    private vehicleTypeService: VehicleTypeService,
    private fb: FormBuilder,
    private router: Router,
    private bankAccountService:BankAccountService
  ) { }

  ngOnInit() {
    this.getAllUsers();
    this.getCountries();
    this.getVehicleData();
     // Initialize the form with controls and validators
 this.bankAccountForm = this.fb.group({
      // Essential Fields for Standard Account
      email: ['', [Validators.required, Validators.email]],
      business_url: ['https://your-platform-url.com', [Validators.required, Validators.pattern(/https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)]],
      country: ['DE', Validators.required], // Fixed country code for Germany; make readonly in template if fixed
    });
    this.accountUpdateForm = this.fb.group({
      business_mcc: ['4789', Validators.required], // Business MCC for transportation
      account_holder_name: ['', Validators.required], // Account holder's name
      account_number: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$')], // IBAN pattern validation
      ],
      country: ['DE'], // Fixed value for Germany
      account_holder_type: ['individual'], // Fixed value for individual
      card_capabilities: [false], // Toggle for card capabilities
      accept_tos: [false, Validators.requiredTrue], // Terms of Service acceptance
    });


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
    const selectElement = (event.target as HTMLSelectElement);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.selectedCountryId = selectedOption.value;
    this.countryObjectId =  selectedOption.id

    this.filterCitiesByCountry();
  }

  filterCitiesByCountry() {
    if (this.selectedCountryId) {
      this.filteredCityArray = this.cityArray.filter(city => city.country === this.selectedCountryId);
      this.cd.detectChanges();
    }
  }

  onCityChange(event: Event) {
    const selectElement = (event.target as HTMLSelectElement);
    this.selectedCityId = selectElement.value;

    // this.getVehicleTypesByCity();
  }

  onCreateUser() {
    this.userObject = this.userForm.value;
    console.log(this.userForm.value);
    const driverObject: any = this.userObject;
    driverObject.countryObjectId = this.countryObjectId
    this.driverListService.createNewUser(driverObject).subscribe((users) => {
      if (users.status === 201) {
        this.getAllUsers(); // Fetch the updated user list
        this.userCreated = true;
      }
      setTimeout(() => {
        this.userCreated = false;
      }, 2500);
      console.log(users);
    });
  }

  getAllUsers() {
    this.driverListService.getAllUsers(this.currentPage, this.pageSize, this.sortBy, this.sortOder).subscribe((response) => {
      this.totalPages = response.totalPages;
      this.userList = response.drivers;
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
    // this.sortParams.sortOrder = orderBy
    this.sortOder = orderBy
  }
  serverHandledSorting(sortParam: string) {
    console.log(sortParam)
    this.sortBy =  sortParam
    this.driverListService.sortAllUsers(this.currentPage, this.pageSize, sortParam, this.sortBy)
      .subscribe((response) => {
        if (response.status === 200) {
          console.log('Sorted table: ', response)
          // this.userList = null;
          this.userList = response.body.drivers
        }
      })
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getAllUsers();
    }
  }

  onUpdateUser() {
    console.log(this.form);
  }

  onDeleteUser(id: string) {
    console.log(id);
    this.driverListService.deleteUser(id).subscribe();
    this.driverListService.getAllUsers(this.currentPage, this.pageSize, this.sortBy, this.sortOder).subscribe((response) => {
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

  onSelectSearchFilter(searchFilter: string) {
    this.searchObject.searchBy = searchFilter
    this.searchByFilter = searchFilter
  }

  onSearchUser() {
    this.searchObject.searchInput = this.searchFormData.value.searchInput;
    console.log(this.searchObject);

    this.driverListService.getSpecificUser(this.searchObject).subscribe(
      (response) => {
        console.log('Search Response:', response);
        // this.user.userProfile = response[0].userProfile
        // this.user.username = response[0].username
        // this.user.email = response[0].email
        // this.user.phone = response[0].phone
        // this.user.countryCode = response[0].countryCode
        if (response.length !== 0) {
          this.userList = null
          this.userList =  response
        } else {
          this.searchUser = false;
        }
      },
      (error) => {
        console.error('Error fetching specific user:', error);
      }
    );
  }

  loveEditingThings(index: any) {
    console.log(index);
    this.driverIndex = index
  }

  onUpdateDriver() {
    console.log(this.updateForm);
    const driverObject = {
      userId: this.driverIndex,
      driverProfile: this.updateForm.value.driverProfile,
      driverName: this.updateForm.value.driverName,
      driverEmail: this.updateForm.value.driverEmail,
      driverPhone: this.updateForm.value.driverPhone,
      countryCode: this.updateForm.value.countryCode,
      city: this.updateForm.value.city
    }
    console.log(driverObject);

    this.driverListService.updateUser(driverObject).subscribe((updatedDriver) => {
      this.getAllUsers()
    })
  }

  toggleDriverStatus(driver: any, status: string) {
    this.driverStatus = status;
    console.log(driver._id, status);
    console.log(driver.city);
    
    this.driverListService.updateDriverStatus(driver._id, this.driverStatus).subscribe((response) => {
      console.log(response);

    
      if (response.status === 'approved') {
        this.toggleStatus = true;
      }
      else if (response.status === 'decline') {
        this.toggleStatus =  false
      }
      this.onAssignVehicle(driver.city)

    })
      this.driverListService.getAllDriverStatus().subscribe((driverStatus) => {
        // console.log("Driver Status : ",driverStatus);
        this.checkDriverStatus(driverStatus.body, driver._id)
      })
  }

  checkDriverStatus(driverStatus, currentDriverId) {
    // console.log("Checking: ", driverStatus, currentDriverId);
    
    const filteredDriverStatusArray = driverStatus.filter((driver) => {
      // console.log(driver._id);
      return driver._id === currentDriverId;
      
    })
    
    this.driverStatusArray = filteredDriverStatusArray;
    console.log("Driver status array: ",this.driverStatusArray);
    if (this.driverStatusArray[0]._id === currentDriverId && this.driverStatusArray[0].status.toLowerCase() === 'approved') {
      this.toggleActivityStatus = true;
    } else {
      this.toggleActivityStatus = false;
    }
  }

  onAssignVehicle(driver) {
    
    this.driverIndexId = driver._id;
    console.log(this.driverIndexId);
    
    // Filtering the pricingDataArray according to the driver's city
    const filteredPricingArray = this.pricingDataArray.filter((object: any) => {
      return object.city.city === driver.city;
    });
    console.log("Filtered Pricing Array: ", filteredPricingArray);
    this.getServiceAssignedToDriver(driver._id, filteredPricingArray);
    // Filtering vehicleDataArray with parameter vehicleType
    const filteredVehicleType = this.vehicleDataArray.filter((vehicle) => {
      // console.log(vehicle)
      
      return filteredPricingArray.some((dataObject) => {
        // console.log(dataObject)
        return vehicle.vehicleType === dataObject.vehicleType;
      });
    });
    console.log("Filtered Vehicle Array: ", filteredVehicleType);
  
  // Combine and merge the filtered arrays based on vehicleType
  const combinedArray = filteredVehicleType.map(vehicle => {
    const pricing = filteredPricingArray.find(pricing => pricing.vehicleType === vehicle.vehicleType);
    return { ...vehicle, ...pricing };
  });

  // Create a map to remove duplicates by vehicleType
  const uniqueCombinedArray = Array.from(new Map(combinedArray.map(item => [item.vehicleType, item])).values());

  console.log("Combined and Unique Array: ", uniqueCombinedArray);
  
  // Update the vehicleDataArray with the unique combined array
    this.combinedPricingAndVehicleObject = uniqueCombinedArray;
      // this.getDriver();
}

  getVehicleData() {
    this.VehiclePricingService.fetchAllPricingData().subscribe((responseData) => {
      if (responseData.status === 200) {
        this.pricingDataArray= responseData.body;
        // console.log("Displaying Pricing Data: ", this.pricingDataArray);
        
      }
    })
    this.vehicleTypeService.onGetVehicle().subscribe((responseData:any) => {
      if (responseData) {
        this.vehicleDataArray =  responseData.vehicles
        // console.log("Displaying Vehicle Data: ", this.vehicleDataArray);
        
      }
    })
    
  } 

onAssignBooking(vehicle, i) {
  console.log(vehicle, i);
  console.log("Inside OnAssignBooking: ",this.driverIndexId);
  
  this.driverObjectIncludeVehicle = { ...vehicle, driverObjectId: this.driverIndexId };
  console.log("Driver with Vehicle Payload: ",this.driverObjectIncludeVehicle);
  
  this.driverListService.assignDriverToVehicle(this.driverObjectIncludeVehicle).subscribe((payLoad) => {
    console.log(payLoad);
    
    // Correct way to remove the element at index i from the array
    this.combinedPricingAndVehicleObject.splice(i, 1);
    
  });

}

  getDriver() {
    this.driverListService.getDriver(this.driverIndexId).subscribe((driver) => {
      if (driver.status === 200) {
        console.log("driver Exists");
        
      } else {
        console.log("driver null");
        console.log(driver.body);
        
      }
    })
  }
  createBankAccount(driver) {
    console.log(driver);
    this.driverId =null
    this.driverId =  driver._id
    
  }
  updateBankDetails(driver) {
    console.log("Update Driver: ", driver)
    this.driverId =null
    this.driverId =  driver._id

  }
    submitUpdatedBankDetails() {
    if (this.accountUpdateForm.valid) {
      const accountData = this.accountUpdateForm.value;
      console.log('Submitted Account Data:', accountData);
      this.bankAccountService.updateStripeAccount(this.driverId, accountData).subscribe((response) => {
        if (response.status === 201) {
          console.log("Account Updated: ", response.body);
          
        }
  })
      // You can make an API call to your backend with the updated data here
    }
  }
  onSubmit() {
    if (this.bankAccountForm.valid) {
      const bankDetails = this.bankAccountForm.value;
      console.log('Form Submitted', bankDetails);
      this.bankAccountService.createNewBankAccount(this.driverId, bankDetails).subscribe(
        (response) => {
          if (response.status === 201) {
            console.log(response);
            this.bankAccountCreated = true;
            // Use window.location.href to redirect to the external Stripe onboarding URL
            window.location.href = response.body.accountLink;
          }
          setTimeout(() => {
            this.bankAccountCreated = false;
          }, 3000);
        },
        (error) => {
          console.error('Error creating standard account:', error);
          // Optionally, display an error message to the user
        }
      );
      // Handle form submission logic here, such as sending the data to the backend
    } else {
      console.log('Form is invalid');
      // Optionally, display validation errors to the user
    }
  }
  getServiceAssignedToDriver(driverId, filteredPricingArray) {
    console.log("ids: ",driverId, filteredPricingArray);
    
    this.driverListService.getAssignDriversToVehicle().subscribe((response) => {
        if (response.status === 200) {
            this.assignedServiceToDriver = response.body;
            console.log("Services: ", this.assignedServiceToDriver);

            // Properly return from filter using some to compare
            const checkingAssignedService = this.assignedServiceToDriver.filter((service) => {
                // Ensure some returns true if any pricing matches the condition
                return filteredPricingArray.some((pricing) => {
                    return service.driverObjectId._id === driverId &&
                        service.vehicleType === pricing.vehicleType;
                });
            });

            console.log("CheckingAssignedService: ", checkingAssignedService);
            this.serviceAssignedCheck  = checkingAssignedService[0]
        } else {
            console.error('Failed to fetch assigned services:', response.status);
        }
    }, error => {
        console.error('Error fetching assigned services:', error);
    });
}

  onUpdateService(vehicle) {
    console.log("Update: ", vehicle)
    this.driverListService.reAssignServiceToDriver(vehicle, this.driverIndexId).subscribe((response) => {
      if (response.status === 200) {
        console.log("Service updated: ", response.body);
          // Example of showing an alert
        Swal.fire({
        title: 'Success!',
        text: 'Service Updated Successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
        });
       
      }
    })
  }
  onDeleteService() {
    this.driverListService.deleteVehicleService(this.driverIndexId).subscribe((response) => {
      if (response.status === 200) {
        console.log("Service Deleted: ", response.body);
          // Example of showing an alert
        Swal.fire({
        title: 'Success!',
        text: 'Service Deleted Successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
});
      }
    })
    
  }


}
