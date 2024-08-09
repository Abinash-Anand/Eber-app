export interface CreateRideForm {
    userId:string,
    phone:number
    paymentOption:string,
    fromLocation:string,
    toLocation:string,
    pickupLocation:string,
    dropOffLocation:string,
    stopLocations:string,
    totalDistance:string,
    EstimatedTime: string,
    totalFare:number,
    serviceType:string,
    bookingOption:string,
    scheduleDateTime: string,
    
}
