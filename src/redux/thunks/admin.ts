import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../utilities/api.service";
import { normalFailMsg, successMsg } from "../../utilities/utils";
import {
  AddNewDriverPayload,
  AdminSettingsForm,
  CarModelPayload,
  Category,
  deleteCarModelPayload,
  GetDriverWeeklyCostPayload,
  SingleDriverResponse,
  UpdateCarModelPayload,
  updateDriverPlayload,
} from "../../TSModels/Admin";
export interface CreateCapoflottaPayload {
  email: string;
  password: string;
  city: string;
  cityId: string;
}

export interface UpdateCapoflottaPayload {
  capoflottaId: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  city: string;
  cityId: string;
}

export interface CreateDittaIndividualePayload {
  email: string;
  password: string;
  city: string;
  cityId: string;
}

export interface UpdateDittaIndividualePayload {
  dittaIndividualeId: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  city: string;
  cityId: string;
}
export const AddNewDriverInfo = createAsyncThunk(
  "api/AddNewDriverInfo",
  async (payload: AddNewDriverPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carDriver/new-carDriver",
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
export const DeleteDriverInfo = createAsyncThunk(
  "api/DeleteDriverInfo",
  async (payload: { driverId: string }, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carDriver/delete-carDriver",
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
export const GetAllDriverInfo = createAsyncThunk(
  "api/GetAllDriverInfo",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("carDriver/all-carDriver");
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
export const UpdateDriverInfo = createAsyncThunk(
  "api/UpdateDriverInfo",
  async (payload: updateDriverPlayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carDriver/update-carDriver",
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
export const AddNewCityRoute = createAsyncThunk(
  "api/AddNewCityRoute",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "cityRoute/new-city-route",
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
export const AllCityRoutes = createAsyncThunk(
  "api/AllCityRoutes",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("cityRoute/all-city-route");
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
export const UpdateCityRoute = createAsyncThunk(
  "api/UpdateCityRoute",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "cityRoute/update-city-route",
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
export const DeleteCityRoute = createAsyncThunk(
  "api/DeleteCityRoute",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "cityRoute/delete-city-route",
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
export const AllHotelOrders = createAsyncThunk(
  "api/AllHotelOrders",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("admin/all-order-bookings");
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
export const getSingleHotelInfo = createAsyncThunk(
  "api/getSingleHotelInfo",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData("hotels/hotel-info", payload);
      const data = response.data.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getSingleDriverInfo = createAsyncThunk(
  "api/getSingleDriverInfo",
  async (payload: SingleDriverResponse, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carDriver/carDriver-info",
        payload
      );
      const data = response.data.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const CreateCarModel = createAsyncThunk(
  "api/CreateCarModel",
  async (payload: CarModelPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carModel/new-carModel",
        payload
      );
      const data = response.data.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const UpdateCarModel = createAsyncThunk(
  "api/UpdateCarModel",
  async (payload: UpdateCarModelPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carModel/update-carModel",
        payload
      );
      const data = response.data.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const DeleteCarModel = createAsyncThunk(
  "api/DeleteCarModel",
  async (payload: deleteCarModelPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "carModel/delete-carModel",
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
export const AllCarModels = createAsyncThunk(
  "api/AllCarModels",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("carModel/all-carModel");
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
export const getAdminSettings = createAsyncThunk(
  "api/getAdminSettings",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("adminSetting/get-setting");
      const data = response.data.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAdminSingleSettings = createAsyncThunk(
  "api/getAdminSingleSettings",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("adminSetting/get");
      const data = response.data.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const saveAdminSettings = createAsyncThunk(
  "api/saveAdminSettings",
  async (payload: AdminSettingsForm, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "adminSetting/create-update-setting",
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
export const GetDriverWeeklyCost = createAsyncThunk(
  "api/GetDriverWeeklyCost",
  async (payload: GetDriverWeeklyCostPayload, thunkAPI) => {
    try {
      const response = await ApiService.getData(
        `business/weekly-info?start=${payload.start}&end=${payload.end}`
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

export const CreateCategory = createAsyncThunk(
  "api/CreateCategory",
  async (payload: Category, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "category/create-category",
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
export const getAllCategories = createAsyncThunk(
  "api/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("category/all-categories");
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

export const deleteCategory = createAsyncThunk(
  "api/deleteCategory",
  async (payload: { _id: string }, thunkAPI) => {
    try {
      const response = await ApiService.deleteData(
        "category/delete-category",
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

export const updateCategory = createAsyncThunk(
  "api/updateCategory",
  async (payload: { _id: string; category: string }, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "category/update-category",
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


export const CreateCapoflotta = createAsyncThunk(
  "api/CreateCapoflotta",
  async (payload: CreateCapoflottaPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "admin/create-capoflotta",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Errore nella creazione del Capoflotta.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const CreateDittaIndividuale = createAsyncThunk(
  "api/CreateDittaIndividuale",
  async (payload: CreateDittaIndividualePayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "admin/create-ditta-individuale",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Errore nella creazione della Ditta individuale.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const GetAllCapoflotta = createAsyncThunk(
  "api/GetAllCapoflotta",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("admin/all-capoflotta");
      const data = response.data?.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Errore nel recupero dei Capoflotta.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const UpdateCapoflotta = createAsyncThunk(
  "api/UpdateCapoflotta",
  async (payload: UpdateCapoflottaPayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "admin/update-capoflotta",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Errore nell'aggiornamento del Capoflotta.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const GetAllDittaIndividuale = createAsyncThunk(
  "api/GetAllDittaIndividuale",
  async (_, thunkAPI) => {
    try {
      const response = await ApiService.getData("admin/all-ditta-individuale");
      const data = response.data?.data;
      return data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Errore nel recupero delle Ditte individuali.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const UpdateDittaIndividuale = createAsyncThunk(
  "api/UpdateDittaIndividuale",
  async (payload: UpdateDittaIndividualePayload, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "admin/update-ditta-individuale",
        payload
      );
      const data = response.data;
      if (response.status === 200) {
        successMsg(data.message);
      }
      return data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Errore nell'aggiornamento della Ditta individuale.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);