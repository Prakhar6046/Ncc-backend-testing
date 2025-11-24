import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../utilities/api.service";
import { normalFailMsg, successMsg } from "../../utilities/utils";
import { RegisterForm } from "../../TSModels/Auth";

export const handleUpdateCompanyData = createAsyncThunk(
  "api/handleUpdateCompanyData",
  async (payload: RegisterForm, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "auth/update-company",
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
export const handleGetCompanyData = createAsyncThunk(
  "api/handleGetCompanyData",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("auth/get-company");
      const data = response.data;
      //   if (response.status === 200) {
      //     successMsg(data.message);
      //   }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const handleGetHotelOrders = createAsyncThunk(
  "api/handleGetHotelOrders",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("services/all-services");
      const data = response.data.data;
      //   if (response.status === 200) {
      //     successMsg(data.message);
      //   }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const RequestService = createAsyncThunk(
  "api/RequestService",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "services/request-service",
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
export const handleDeleteHotel = createAsyncThunk(
  "api/handleDeleteHotel",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "auth/delete-company",
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
