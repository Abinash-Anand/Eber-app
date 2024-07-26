export interface Pricing {
    country: string,
    city: string,
    vehicleType: string,
    driverProfit: number,
    minFare: number,
    distanceForBasePrice: number,
    basePrice: number ,
    pricePerUnitDistance: number,
    pricePerUnitTime: number,
    maxSpace: number,
}
