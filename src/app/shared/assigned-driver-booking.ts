export interface AssignedDriverBooking {

  driverObject: string; 
  userId: string; 
  phone: number;
  paymentOption: string;
  selectedCard?: string;
  fromLocation: string;
  toLocation: string;
  pickupLocation: string;
  dropOffLocation: string;
  stopLocations?: string;
  totalDistance: string;
  estimatedTime: string;
  serviceType: string;
  bookingOption: string;
  scheduleDateTime?: string;
  status: string

}
