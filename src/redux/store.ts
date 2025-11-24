import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import hotelReducer from "./reducers/hotelProfile";
import adminReducer from "./reducers/adminSlice";
import paymentReducer from "./reducers/paymentSlice";
import superAdminReducer from "./reducers/superAdminSlice";
import carModelReducer from "./reducers/carModelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
    admin: adminReducer,
    payment: paymentReducer,
    superAdmin: superAdminReducer,
    carModel:carModelReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
