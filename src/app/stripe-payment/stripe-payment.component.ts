import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environment';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {
  stripe: any;
  card: any;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async handlePayment() {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.error('Error creating token:', error);
    } else {
      console.log('Token created:', token);
      this.sendTokenToServer(token);
    }
  }

  sendTokenToServer(token: any) {
    this.http.post(`${environment.backendServerPORT}/create-payment-intent`, { token }).subscribe(
      response => {
        console.log('Server response:', response);
      },
      error => {
        console.error('Server error:', error);
      }
    );
  }
}
