import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.css'
})
export class DriverListComponent implements OnInit {
  driverCreated: boolean = false;
  @ViewChild('form') formData: NgForm;
  @ViewChild('updateForm') updateForm: NgForm;
  users: Signup[] = [];
  userObject: any = {
    userProfile: '',
    username: '',
    email: '',
    phone: '',
    countryCode: '',
    city: ''
  };
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
  updateUserData: {
    userProfile: string, username: string, email: string, phone: string, userId: string,
    countryCode: string, city: string
  } = {
      userProfile: '', username: '', email: '',
      phone: null, userId: '', countryCode: '', city: ''
    }
  user: { userProfile: string, username: string, email: string, phone: string, countryCode: string, city: '' } = {
    userProfile: '', username: '', email: '', phone: '', countryCode: '', city: ''
  }
  driverIndexId: string = '';
  searchObject: { searchBy: string, searchInput: string } = { searchBy: '', searchInput: '' }
  @ViewChild('searchForm') searchFormData: NgForm;
  @ViewChild('form') userForm: NgForm;
  @ViewChild('form') form: NgForm;

  constructor(
    private driverListService: DriverlistService,
    private countryApiService: CountryApiService,
    private cityService: CityService,
    private cd: ChangeDetectorRef,
    private rideService: RideService,
    private VehiclePricingService: VehiclePricingService,
    private vehicleTypeService: VehicleTypeService
  ) { }

  ngOnInit() {
    this.getAllUsers();
    this.getCountries();
    this.getVehicleData();
    
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

    this.driverListService.createNewUser(this.userObject).subscribe((users) => {
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
    this.driverListService.getAllUsers(this.currentPage, this.pageSize).subscribe((response) => {
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
  }

  onDeleteUser(id: string) {
    console.log(id);
    this.driverListService.deleteUser(id).subscribe();
    this.driverListService.getAllUsers(this.currentPage, this.pageSize).subscribe((response) => {
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
        console.log('Search Response:', response.length);
        this.user.userProfile = response[0].userProfile
        this.user.username = response[0].username
        this.user.email = response[0].email
        this.user.phone = response[0].phone
        this.user.countryCode = response[0].countryCode
        if (response.length !== 0) {
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
  console.log(driver.city);
  
  // Filtering the pricingDataArray according to the driver's city
  const filteredPricingArray = this.pricingDataArray.filter((object: any) => {
    return object.city.city === driver.city;
  });
  console.log("Filtered Pricing Array: ", filteredPricingArray);
  
  // Filtering vehicleDataArray with parameter vehicleType
  const filteredVehicleType = this.vehicleDataArray.filter((vehicle) => {
    return filteredPricingArray.some((dataObject) => {
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
  console.log(this.driverIndexId);
  
  this.driverObjectIncludeVehicle = { ...vehicle, driverObjectId: this.driverIndexId };
  console.log(this.driverObjectIncludeVehicle);
  
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
  getAllBookings() {
    
  }
 
}
