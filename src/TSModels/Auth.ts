export interface AuthInitialState {
  isLoading: boolean;
  isSuccess: boolean;
  userData: User | null;
}
export interface RegisterForm {
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
  confirmPassword: string;
  termsAccepted: Boolean;
}
export interface LoginForm {
  email: string;
  password: string;
  admin: boolean;
}
export interface RegisterResponse {
  status: boolean;
  message: string;
}
export interface LoginResponse {
  status: boolean;
  data: User;
  message: string;
}
export interface User {
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
  token?: string;
}
