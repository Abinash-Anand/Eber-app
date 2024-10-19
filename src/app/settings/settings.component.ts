import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SettingsService } from '../services/settings/settings.service';
import { Settings } from '../shared/settings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  acceptRequestTime: number = 30; // Default value or initialize as needed
    // stripeSettingsForm!: FormGroup;

  maxStops: number = 2; // Default value or initialize as needed
  stripeSettingsForm: FormGroup;

  loading = false;
  successMessage: string = '';
  settingObject: Settings = {
    id:"DEFAULT",
    requestAcceptTime: null,
    numberOfStops:null,
  };
  emailConfigForm: FormGroup;
  newSettings: boolean = false;
  DefaultSettings:boolean = false
  settingId: string = '';
  //  apiKeysForm: FormGroup;
  // phoneNumbersForm: FormGroup;
  // messageSettingsForm: FormGroup;
    twilioSettingsForm: FormGroup;

  constructor(private settingsService: SettingsService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.disableDefaultSettings()
    this.emailConfigForm = this.fb.group({
      smtpHost: ['', Validators.required],
      smtpPort: [587, [Validators.required, Validators.min(1)]],
      secureConnection: [false],
      emailUser: ['', [Validators.required, Validators.email]],
      emailPass: ['', Validators.required],
      fromName: ['', Validators.required],
      fromEmail: ['', [Validators.required, Validators.email]],
    });
    // this.initForms();
     this.twilioSettingsForm = this.fb.group({
      accountSid: ['', Validators.required],
      authToken: ['', Validators.required],
      twilioPhoneNumber: ['', Validators.required],
      whatsappNumber: ['', Validators.required],
      defaultMessage: [''],
      whatsappMessage: [''],
     });
    //stripe settings
     this.stripeSettingsForm = this.fb.group({
      stripeSecretKey: ['', Validators.required],
      defaultCurrency: ['USD', Validators.required],
      driverPayoutFrequency: ['weekly', Validators.required],
      stripeMode: ['Test', Validators.required],
    });

  }
  
 // Submit handler to save updated Stripe settings
  defaultStripeSettings(): void {
    if (this.stripeSettingsForm.valid) {
      const formValues = this.stripeSettingsForm.value;
      console.log('Stripe Settings Saved:', formValues);

      this.settingsService.updateStripeSettings(formValues).subscribe(
        (response) => {
          console.log('Settings updated successfully:', response);
        },
        (error) => {
          console.error('Error updating settings:', error);
        }
      );
    }
  }

  // defaultStripeSettings(){}
  // initForms() {
  //   this.apiKeysForm = this.fb.group({
  //     accountSid: ['', Validators.required],
  //     authToken: ['', Validators.required]
  //   });

  //   this.phoneNumbersForm = this.fb.group({
  //     twilioPhoneNumber: ['', Validators.required],
  //     whatsappNumber: ['', Validators.required]
  //   });

  //   this.messageSettingsForm = this.fb.group({
  //     defaultMessage: ['', Validators.required],
  //     whatsappMessage: ['', Validators.required]
  //   });
  // }

  // saveApiKeys() {
  //   if (this.apiKeysForm.valid) {
  //     const apiKeysData = this.apiKeysForm.value;
  //     console.log('API Keys saved:', apiKeysData);
  //     // this.settingsService.defaultTwillioMessageSettings(messageObject).subscribe((response) => {
  //     //   if (response.status === 200) {
  //     //     console.log("message Settings: ", response.body)
  //     //     alert('Message Settings Set to Default')
  //     //   }
  //     // })
  //     // Save the data via service or API call
  //   }
  // }

  // savePhoneNumbers() {
  //   if (this.phoneNumbersForm.valid) {
  //     const phoneNumbersData = this.phoneNumbersForm.value;
  //     console.log('Phone Numbers saved:', phoneNumbersData);
  //     // Save the data via service or API call
  //   }
  // }

  // saveMessageSettings() {
  //   if (this.messageSettingsForm.valid) {
  //     const messageSettingsData = this.messageSettingsForm.value;
  //     console.log('Message Settings saved:', messageSettingsData);
  //     // Save the data via service or API call
  //   }
  // }

   saveTwilioSettings(): void {
    if (this.twilioSettingsForm.valid) {
      console.log('Twilio Settings:', this.twilioSettingsForm.value);
      const messageObject = this.twilioSettingsForm.value
     this.settingsService.defaultTwillioMessageSettings(messageObject).subscribe((response) => {
        if (response.status === 200) {
          console.log("message Settings: ", response.body)
          alert('Message Settings Set to Default')
        }
      })
    }
  }

  disableDefaultSettings() {
     const id = 'DEFAULT';

    this.settingsService.getDefaultSettings().subscribe(response => {
       if (response.status === 200 && response.body && response.body.length > 0) {
        this.DefaultSettings = true;
        this.acceptRequestTime = response.body[0].requestAcceptTime
        this.maxStops  =  response.body[0].numberOfStops
        this.settingsService.settingArray[0].requestAcceptTime = response.body[0].requestAcceptTime
        this.settingsService.settingArray[0].numberOfStops =response.body[0].numberOfStops
      } else {
        this.DefaultSettings = false;
      }
      console.log("server response", response);
    });
  }

  getDefaultSettings() {
    const defaultSettings = {
      acceptRequestTime: this.acceptRequestTime,
      maxStops:this.maxStops
    }

  }
  onSelectWaitingTime(event: Event) {
    const waitingTime = event.target as HTMLSelectElement
    this.acceptRequestTime = +waitingTime.value
    console.log(this.acceptRequestTime);
    // this.settingsService.settingArray[0].requestAcceptTime = this.acceptRequestTime
   
  
  }

  onSelectStop(stop: Event) {
    const stops = stop.target as HTMLSelectElement;
    this.maxStops = +stops.value
    console.log(this.maxStops);
   
    // this.settingsService.settingArray[0].numberOfStops = this.maxStops
    
    // this.settingsService.logArray()
  }
  updateSettings() {
    this.settingObject.requestAcceptTime = this.acceptRequestTime;
    this.settingObject.numberOfStops = this.maxStops
    this.settingsService.updateDefaultSettings(this.settingObject).subscribe((newSettingResponse) => {
      if (newSettingResponse.status === 200 && newSettingResponse.body !== null) {
        this.disableDefaultSettings()
        console.log("New Settings have been added");
        this.newSettings = true
      }
      setTimeout(() => {
        this.newSettings =  false
      }, 2500);
      
    })

  }
  setDefaultSettings() {
    const   requestAcceptTime = 30
    const numberOfStops = 2;
    const defaultSettings = {
      id:"DEFAULT",
      requestAcceptTime,
      numberOfStops,
    }
    this.settingsService.postDefaultSettings(defaultSettings).subscribe((settingResponse) => {
      if (settingResponse.status === 200) {
        this.DefaultSettings = true;
        setTimeout(() => {
        alert("Settings set to Default")
      }, 1000);
      }
          
    })
    
    
  }
   onSubmit() {
    if (this.emailConfigForm.valid) {
      const emailSettings = this.emailConfigForm.value;
      console.log('Email Settings:', emailSettings);
      this.settingsService.defaultEmailSettings(emailSettings).subscribe((response) => {
        if (response.status === 200) {
          console.log("New email settings added")
          alert('New Email settings')
        }
      })
      // Save or send the settings to your server
    } else {
      console.log('Form is invalid');
    }
  }
}
