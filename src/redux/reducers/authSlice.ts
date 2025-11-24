import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  handleCompanyLogin,
  handleCompanyRegister,
  handleForgotPassword,
  handleResetPassword,
} from "../thunks/auth";
import {
  AuthInitialState,
  LoginResponse,
  RegisterResponse,
} from "../../TSModels/Auth";
import { encryptData } from "../../utilities/utils";

const initialState: AuthInitialState = {
  isLoading: false,
  isSuccess: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthStates: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleCompanyRegister.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handleCompanyRegister.fulfilled,
      (state, action: PayloadAction<RegisterResponse>) => {
        state.isSuccess = action.payload.status;
        state.isLoading = false;
      }
    );
    builder.addCase(handleCompanyRegister.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(handleCompanyLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handleCompanyLogin.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        state.isSuccess = action.payload.status;
        state.userData = action.payload.data;
        encryptData("nccUser", action.payload.data);
        encryptData("nccToken", action.payload?.data?.token);
        state.isLoading = false;
      }
    );
    builder.addCase(handleCompanyLogin.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(handleForgotPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handleForgotPassword.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isLoading = false;
      }
    );
    builder.addCase(handleForgotPassword.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(handleResetPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handleResetPassword.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isLoading = false;
      }
    );
    builder.addCase(handleResetPassword.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Actions
export const authActions = authSlice.actions;

// Selectors
export const selectSuccess = (state: RootState) => {
  return state.auth.isSuccess;
};
export const SelectUserData = (state: RootState) => {
  return state.auth.userData;
};
export const selectIsLoading = (state: RootState) => {
  return state.auth.isLoading;
};
// Reducer
const authReducer = authSlice.reducer;
export default authReducer;
