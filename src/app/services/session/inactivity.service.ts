import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  private timeoutId: any;
  private readonly timeout: number = 15 * 60 * 1000; // 15 minutes
  private activityEvents$: Observable<Event>;
  private activitySubscription: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.activityEvents$ = merge(
        fromEvent(document, 'click'),
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'scroll')
      );
      this.setupActivityListeners();
    }
  }

  setupActivityListeners() {
    console.log('Setting up activity listeners');
    this.ngZone.runOutsideAngular(() => {
      this.activitySubscription = this.activityEvents$
        .pipe(
          debounceTime(300),
          tap(() => this.resetTimer())
        )
        .subscribe();
      this.startTimer();
    });
  }

  removeActivityListeners() {
    console.log('Removing activity listeners');
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }

  startTimer() {
    console.log('Starting inactivity timer');
    this.timeoutId = setTimeout(() => {
      console.log('Inactivity timeout reached');
      this.logout();
    }, this.timeout);
  }

  resetTimer() {
    console.log('Resetting inactivity timer');
    clearTimeout(this.timeoutId);
    this.startTimer();
  }

  logout() {
    console.log('Logging out due to inactivity');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
