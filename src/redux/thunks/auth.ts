import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginForm, RegisterForm } from "../../TSModels/Auth";
import { ApiService } from "../../utilities/api.service";
import { normalFailMsg, successMsg } from "../../utilities/utils";

export const handleCompanyRegister = createAsyncThunk(
  "api/handleCompanyRegister",
  async (payload: RegisterForm, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "auth/register-company",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const handleCompanyLogin = createAsyncThunk(
  "api/handleCompanyLogin",
  async (payload: LoginForm, thunkAPI) => {
    try {
      const response = await ApiService.postData("auth/login-company", payload);
      const data = response.data;
      // if (response.status === 200) {
      //   successMsg(data.message);
      // }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const handleForgotPassword = createAsyncThunk(
  "api/handleForgotPassword",
  async (payload: { email: string }, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "auth/forgot-password",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const handleResetPassword = createAsyncThunk(
  "api/handleResetPassword",
  async (
    payload: {
      password: string;
      userId: string | undefined;
      token: string | undefined;
    },
    thunkAPI
  ) => {
    try {
      const response = await ApiService.postData(
        "auth/reset-password",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      
      normalFailMsg(errorMessage);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
