/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environment';



// // Utility function to convert VAPID key to Uint8Array
// function urlBase64ToUint8Array(base64String: string): Uint8Array {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// // Service worker registration and push subscription
// if ('serviceWorker' in navigator && 'PushManager' in window) {
//   navigator.serviceWorker.register('/service-worker.js')
//     .then(registration => {
//       console.log('Service Worker registered with scope:', registration.scope);
      
//       // Request push notification permission
//       return Notification.requestPermission();
//     })
//     .then(permission => {
//       if (permission === 'granted') {
//         console.log('Notification permission granted.');

//         // Subscribe the user to push notifications
//         return navigator.serviceWorker.ready;
//       } else {
//         console.error('Notification permission denied.');
//       }
//     })
//     .then(registration => {
//       return registration.pushManager.getSubscription()
//         .then(subscription => {
//           if (subscription) {
//             console.log('Already subscribed:', subscription);
//             return subscription;
//           }

//           // Subscribe the user
//           const vapidPublicKey = environment.webPushPublicKey; // Replace with your VAPID public key
//           return registration.pushManager.subscribe({
//             userVisibleOnly: true,
//             applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
//           });
//         })
//         .then(newSubscription => {
//           console.log('New subscription:', newSubscription);



//              // Extract keys
//           const p256dh = newSubscription.getKey('p256dh');
//           const auth = newSubscription.getKey('auth');
//           const endpoint = newSubscription.endpoint
//           const subscriptionObject = {p256dh,auth, endpoint}
//           // Convert keys to base64
//           const base64Url = (buffer) => {
//             const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
//             return window.btoa(binary)
//               .replace(/\+/g, '-')
//               .replace(/\//g, '_')
//               .replace(/=+$/, '');
//           };

//           console.log('p256dh:', base64Url(p256dh));
//           console.log('auth:', base64Url(auth));

//           // Send the subscription object to your server
//           return fetch(`${environment.backendServerPORT}/subscribe`, {
//             method: 'POST',
//             body: JSON.stringify(newSubscription),
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log('Server response:', data);
//         })
//         .catch(error => {
//           console.error('Subscription request failed:', error);
//         });
//     })
//     .catch(error => {
//       console.error('Service Worker registration failed:', error);
//     });
// }


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
