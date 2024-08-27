// // inactivity-tracker.service.ts
// import { Injectable, HostListener } from '@angular/core';
// import { Subject, timer } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { LoginService } from '../authentication/login.service';
// // import { LoginService } from './login.service'; // Import LoginService

// @Injectable({
//   providedIn: 'root'
// })
// export class UserActivityService {
//   private inactivityTimeout =1 * 60 * 1000; // 20 minutes
//   private activitySubject = new Subject<void>();
//   private timeoutId: any;

//   constructor(private loginService: LoginService) { // Inject LoginService
//     this.startTracking();
//   }

//  private startTracking() {
//   console.log('Inactivity tracking started');
//   this.activitySubject.pipe(
//     switchMap(() => timer(this.inactivityTimeout))
//   ).subscribe(() => {
//     console.log('Inactivity timeout reached');
//     this.loginService.autoLoguot();
//   });

//   // Listen for user activity
//   this.resetTimer();
// }

// @HostListener('window:mousemove')
// @HostListener('window:keydown')
// @HostListener('window:scroll')
// onUserActivity() {
//   console.log('User activity detected');
//   this.resetTimer();
// }
//  private resetTimer() {
//   if (this.timeoutId) {
//     clearTimeout(this.timeoutId);
//   }
//   console.log('Timer reset');
//   this.timeoutId = setTimeout(() => {
//     console.log('Inactivity timeout reached after reset');
//     this.loginService.autoLoguot();
//   }, this.inactivityTimeout);
// }
// }
