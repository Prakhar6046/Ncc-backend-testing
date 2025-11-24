import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../utilities/api.service";
import { normalFailMsg, successMsg } from "../../utilities/utils";
import {
  CreateAdminPayload,
  CreateCityPayload,
} from "../../TSModels/SuperAdmin";

export const CreateNewAdmin = createAsyncThunk(
  "api/CreateNewAdmin",
  async (payload: CreateAdminPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "admin/register-admin",
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
export const UpdateAdminData = createAsyncThunk(
  "api/UpdateAdminData",
  async (payload: CreateAdminPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData("admin/update-admin", payload);
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
export const DeleteAdmin = createAsyncThunk(
  "api/DeleteAdmin",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData("admin/delete-admin", payload);
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
export const GetAllAdmins = createAsyncThunk(
  "api/GetAllAdmins",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("admin/all-admin");
      const data = response.data?.data;
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
export const GetAllAdminCity = createAsyncThunk(
  "api/GetAllAdminCity",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("city/all-city");
      const data = response.data?.data;
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
export const GetAllCityWithAdmin = createAsyncThunk(
  "api/GetAllCityWithAdmin",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("city/all-city-with-admins");
      const data = response.data?.data;
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
export const CreateNewCity = createAsyncThunk(
  "api/CreateNewCity",
  async (payload: CreateCityPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData("city/add-city", payload);
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
export const UpdateCityData = createAsyncThunk(
  "api/UpdateCityData",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData("city/edit-city", payload);
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
export const DeleteAdminCity = createAsyncThunk(
  "api/DeleteAdminCity",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData("city/delete-city", payload);
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
export const AllHotelsList = createAsyncThunk(
  "api/AllHotelsList",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("hotels/all-hotels");
      const data = response.data.data;
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
export const GetBuisnessInfo = createAsyncThunk(
  "api/GetBuisnessInfo",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("business/business-info");
      const data = response.data.data;
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
