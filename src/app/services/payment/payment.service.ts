// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  stripe: Stripe | null = null;
  card: any;

  constructor(private http: HttpClient) { }

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
      throw error;
    } else {
      console.log('Token created:', token);
      return { token };
    }
  }

  sendTokenToServer(token: any):Observable<HttpResponse<any>> {
    return this.http.post<any>(`${environment.backendServerPORT}/create-payment-intent`, { token , observe:'response'});
  }
}
