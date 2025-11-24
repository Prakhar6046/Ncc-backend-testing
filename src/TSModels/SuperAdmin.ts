import { SingleHotel } from "./Admin";

export interface City {
  _id: string;      
  cityName: string;
  cityUsed: boolean;
}



export interface SuperAdminInitialState {
  isLoading: boolean;
  isSuccess: boolean;
  AllAdminsList: SingleAdmin[];
  isUpdatedLoading: boolean;
  AllCityList: SingleCity[];
  AllHotelInfo: SingleHotel[];
  BuisnessInfo: any;
  CityWithAdmin:City[];
  CityWithAdminLoading:boolean;
  CityWithAdminSuccess:Boolean;
  
}
export interface SingleAdmin {
  superAdmin: boolean;
  _id: string;
  email: string;
  password: string;
  city: string;
  cityId: string;
}
export interface SingleCity {
  _id: string;
  cityName: string;
  cityUsed: boolean;
}
export interface CreateAdminPayload {
  cityId: string | undefined;
  city: string | undefined;
  password: string;
  email: string;
  adminId?: string;
}
export interface CreateCityPayload {
  cityName: string;
  cityId?: string;
}
