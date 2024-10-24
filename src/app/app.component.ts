import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './services/authentication/login.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../environment';
import { NotificationService } from './services/notification/notification.service';

// import { SwPush, SwUpdate } from '@angular/service-worker';
// import { SocketService } from './services/sockets/socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eber-app';
  isLoggedIn: boolean = false;
  sessionTime: string = ''
  // readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;
  // private readonly notificationPublicKey = environment.webPushPublicKey
  private loginStatusSubscription: Subscription;
  publicVapidKey:string = environment.vapidPublicKey
  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private bnIdle: BnNgIdleService,
    private spinner: NgxSpinnerService,
    // private swUpdate: SwUpdate,
    // private swPush: SwPush,
    // private socketService:SocketService
    private notificationService: NotificationService
  ) {  
    
  }

 // Function to trigger push notifications
  async notification() {
    if ('serviceWorker' in navigator) {
      try {
        // Check notification permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          console.log("Notification permission granted.");
          // Register service worker
          console.log("Registering service worker...");
          const register = await navigator.serviceWorker.register('/assets/sw.js');
          console.log("Service worker registered...");

          // Wait for service worker to become active
          await this.waitForServiceWorkerActivation(register);

          // Register Push
          console.log("Registering Push...");
          const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey),
          });
          console.log("Push Registered...", subscription);

          // Send Push Notification to the server
          console.log("Sending Push Subscription to the backend...");
          await this.sendPushSubscription(subscription);
        } else {
          console.error("Notification permission denied.");
        }
      } catch (err) {
        console.error('Error during registration', err);
      }
    }
  }

  // Utility function to convert VAPID public key to Uint8Array
  urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Wait for service worker to become active
  async waitForServiceWorkerActivation(register: ServiceWorkerRegistration) {
    if (register.active) {
      return register.active;
    }
    return new Promise<void>((resolve) => {
      console.log("Waiting for service worker activation...");
      register.addEventListener('updatefound', () => {
        const newWorker = register.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log("Service worker activated...");
              resolve();
            }
          });
        }
      });
    });
  }

  // Send the subscription to the backend (mock example)
  async sendPushSubscription(subscription: PushSubscription) {
    console.log('Sending subscription to the backend...', subscription);
    this.notificationService.notificationSubscription(subscription).subscribe((response) => {
      console.log('Notification Backend Response: ', response)
    })
    // Here you would typically send the subscription to your backend
    // await this.http.post('your-backend-api/save-subscription', subscription).toPromise();
  }

  ngOnInit() {
    // Automatically subscribe to notifications when the app loads

    this.checkAuth();
    this.bnIdle.startWatching(1200).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.loginService.autoLoguot()
        this.bnIdle.stopTimer();
      }
    });
    /** spinner starts on init */
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show the spinner when navigation starts
        this.spinner.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Hide the spinner when navigation ends, is canceled, or there's an error
        this.spinner.hide();
      }
    });
    // Automatically trigger the push notification setup when the app starts
    this.notification();
  }
  lottieOptions = {
    path: '../../assets/icons/appBackground.json'         // URL to your JSON file
  };
  checkAuth() {
    this.loginStatusSubscription = this.loginService.loginStatus$.subscribe(status => {
      this.isLoggedIn = status;
      // if (this.isLoggedIn) {
      //   this.router.navigate(['/']);
      // }
      console.log('Login status changed:', status);
    });
  }

  stateChange() {
    this.isLoggedIn = true;
    this.checkAuth();
  }

  ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }

  logout() {
    this.loginService.logoutUser();
  }

  checkUpdate() {
    
  }
  // pushSubscription() {
  //   if (!this.swPush.isEnabled) {
  //     console.log("Notification is not enabled");
      
  //   }
  //   this.swPush.requestSubscription({
  //     serverPublicKey: this.notificationPublicKey,
  //   }).then((sub)=> console.log("RequestSubscription: ", sub)
  //   ).catch((err) => {
  //     console.log(err);
      
  //   })
  // }
}
