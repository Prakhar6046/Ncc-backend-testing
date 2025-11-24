export interface GetHotelResponse {
  status: true;
  data: HotelData;
  message: string;
}
export interface HotelData {
  _id: string;
  email: string;
  surname: string;
  companyName: string;
  piva: string;
  address: string;
  city: string;
  pec: string;
  sdi: string;
  name: string;
}
export interface HotelInitialState {
  isLoading: boolean;
  isSuccess: boolean;
  hotelData: HotelData;
  hotelOrders: SingleHotelOrder[];
  isDelete: boolean;
}
export interface SingleHotelOrder {
  _id: string;
  CompanyId: string;
  selectedRouteId: string;
  isReverse: true;
  from: string;
  to: string;
  orderNumber: number;
  hotelOrderNumber:number;
  totalPrice: number;
  driverAccept: boolean;
  preferVehicel: number;
  clientName: string;
  telePhone: number;
  noOfPassengers: number;
  appointmentTime: string;
  appointmentDate: string;
  usefulInformation: string;
  city: string,
  driverId: string,
  driverName: string
  completeOrder: boolean
}

