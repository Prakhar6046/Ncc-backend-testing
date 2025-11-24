import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
// import { encryptData } from "../../utilities/utils";
import { PaymentInitialState } from "../../TSModels/Payment";
import { handlePayment } from "../thunks/payment";

const initialState: PaymentInitialState = {
  isLoading: false,
  isSuccess: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetpaymentStates: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handlePayment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handlePayment.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = true;
        state.isLoading = false;
        window.location.href = action.payload;
      }
    );
    builder.addCase(handlePayment.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Actions
export const paymentActions = paymentSlice.actions;

// Selectors
export const selectSuccess = (state: RootState) => {
  return state.payment.isSuccess;
};
export const selectIsPaymentLoading = (state: RootState) => {
  return state.payment.isLoading;
};
// Reducer
const paymentReducer = paymentSlice.reducer;
export default paymentReducer;
