// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { catchError, Observable, throwError } from 'rxjs';

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
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
    });

    if (error) {
      console.error('Error creating payment method:', error);
      throw error;
    } else {
      console.log('Payment method created:', paymentMethod);
      return { paymentMethod };
    }
  }

  sendPaymentMethodToServer(paymentMethod: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${environment.backendServerPORT}/create-payment-intent`, { paymentMethod }, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  fetchUserCards(id: string) {
    return this.http.get<any>(`${environment.backendServerPORT}/fetch-all-cards/${id}`, { observe: 'response' });
  }

  fetchUserSpecificCards(userId):Observable<HttpResponse<any>> {
    return this.http.get<any[]>(`${environment.backendServerPORT}/stripe/cards/user-cards/${userId}`, {observe:"response"})
  }
  deleteCard(cardId): Observable<HttpResponse<any>>{
    return this.http.delete<any[]>(`${environment.backendServerPORT}/stripe/cards/delete-one/${cardId}`, {observe:"response"})
  }
  updateDefaultCardStatus(cardPayload):Observable<HttpResponse<any>> {
    return this.http.patch<any>(`${environment.backendServerPORT}/stripe/cards/update/make-default`,{cardPayload}, {observe:'response'})
  }
}
