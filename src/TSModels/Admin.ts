import { HotelData } from "./Hotel";
export interface AddNewDriver {
  carModel?: string;
  driverName: string;
  driverSurname: string;
  accessTheApp: number;
  driverEmail: string;
  driverPassword: string;
  confirmPassword:string;
  cityOfService: string;
  category: string;
}
export interface SingleCityRoute {
  _id: string;
  adminUserId: string;
  from: string;
  to: string;
  averageTravelTime: number;
  driverCost: number;
  adminCost: number;
  cooperativeCost: number;
  ditteCost: number;
  totalPrice: number;
  city: string;
}
export interface SingleDriverInfo {
  _id: string;
  adminUserId: string;
  driverName: string;
  driverSurname: string;
  accessTheApp: boolean;
  driverEmail: string;
  driverPassword: string;
  cityOfService: string;
  licenseNumber: string;
  carModel: any;
  category: string;
}
export interface AdminInitialState {
  isWeeklyLoading: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  AllCityRoutes: SingleCityRoute[];
  AllDriverInfo: SingleDriverInfo[];
  hotelData: HotelData;
  driverData: DriverData;
  AllHotelOrders: SingleHotelOrder[];
  isUpdatedLoading: boolean;
  adminSettings: AdminSettingsForm;
  singleAdmin: AdminSettingInfo;
  weeklyCost: WeeklyDriverCost[];
  CategoriesList: [];
  deleteLoading:boolean;
  deleteSuccess:boolean;
  addDriverloading:boolean;
  addDriverSuccess:boolean;
  updateDriverLoading:boolean;
  updateDriverSuccess:boolean;
  AllCapoflotta: Admin[];
  AllDittaIndividuale: Admin[];
}
export interface SingleHotel {
  _id: string;
  email: string;
  password: string;
  surname: string;
  name: string;
  companyName: string;
  piva: string;
  address: string;
  city: string;
  pec: string;
  sdi: string;
}
export interface SingleHotelOrder {
  adminUserId: string;
  appointmentDate: string;
  appointmentTime: string;
  clientName: string;
  driverAccept: boolean;
  from: string;
  companyId: string;
  hotelName: string;
  isReverse: boolean;
  noOfPassengers: number;
  orderNumber: number;
  preferVehicel: number;
  selectedRouteId: string;
  telePhone: number;
  to: string;
  totalPrice: number;
  usefulInformation: string;
  _id: string;
  driverName: string;
  driverId: string;
  completeOrder: boolean;
}
export interface DriverData {
  _id: string;
  carType: number;
  driverName: string;
  driverSurname: string;
  targa: string;
  module: string;
  cityOfService: string;
  licenseNumber: string;
}
export interface CarModelPayload {
  carType: number;
  targa: string;
  module: string;
  cityOfService: string;
  licenseNumber: string;
}
export interface UpdateCarModelPayload {
  carModelId: string | undefined;
  carType: number;
  targa: string;
  module: string;
  cityOfService: string;
  licenseNumber: string;
}
export interface deleteCarModelPayload {
  carModelId: string;
}
export interface CarModelInitialState {
  isLoading: boolean;
  isSuccess: boolean;
  allCarModelsInfo: SingleCarModelInfo[];
   createSuccess:boolean,
  createLoading:boolean,
    deleteSuccess:boolean,
  deleteLoading:boolean,
}
export interface AddNewCarModel {
  carType: number;
  targa: string;
  module: string;
  cityOfService: string;
  licenseNumber: string;
}
export interface SingleCarModelInfo {
  _id: string;
  adminUserId: string;
  carType: number;
  targa: string;
  module: string;
  cityOfService: string;
  licenseNumber: string;
  driverAssign: boolean;
}
export interface SingleDriverResponse {
  CarDriverId: string;
}
export interface AddNewDriverPayload {
  carModel?: string;
  driverName: string;
  driverSurname: string;
  accessTheApp: boolean;
  driverEmail: string;
  driverPassword: string;
  cityOfService: string;
  category: string;
}
export interface updateDriverPlayload {
  carDriverId: string | undefined;
  carModel?: string;
  driverName: string;
  driverSurname: string;
  accessTheApp: boolean;
  driverEmail: string;
  driverPassword: string;
  cityOfService: string;
  category: string;
}
export interface RoleCost {
  fixedCost: number;
  costPerKm: number;
}

export interface VehicleTypeCosts {
  admin: RoleCost;
  cooperative: RoleCost;
  driver: RoleCost;
  ditta_individuale: RoleCost;
}

export interface MileageBand {
  kmMin: number;
  kmMax: number;
  vehicleTypes: {
    berlina: VehicleTypeCosts;
    van: VehicleTypeCosts;
    lusso: VehicleTypeCosts;
  };
}

export interface AdminSettingsForm {
  mileageBands: MileageBand[];
}

export interface AdminSettings {
  cityName: string;
}
export interface Admin {
  _id: string;
  email: string;
  password: string;
  city: string;
  cityId: string;
  superAdmin: boolean;
  __v: number;
}
export interface AdminSettingInfo {
  _id: string;
  adminUserId: string;
  mileageBands: MileageBand[];
  __v: number;
}
export interface AdminSettingsResponse {
  admin: Admin;
  AdminSettingInfo: AdminSettingInfo;
}
export interface GetDriverWeeklyCostPayload {
  start: string;
  end: string;
}
export interface WeeklyDriverCost {
  category: string;
  total: number;
  drivers: {
    name: string;
    total: number;
  }[];
}

export interface Category {
  category: string;
}
