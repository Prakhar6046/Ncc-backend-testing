import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  AddNewCityRoute,
  AddNewDriverInfo,
  AllCityRoutes,
  AllHotelOrders,
  CreateCategory,
  deleteCategory,
  DeleteCityRoute,
  DeleteDriverInfo,
  getAdminSettings,
  getAdminSingleSettings,
  getAllCategories,
  GetAllDriverInfo,
  GetDriverWeeklyCost,
  getSingleDriverInfo,
  getSingleHotelInfo,
  saveAdminSettings,
  UpdateCityRoute,
  UpdateDriverInfo,
  CreateCapoflotta,
  CreateDittaIndividuale,
  GetAllCapoflotta,
  GetAllDittaIndividuale,
  UpdateCapoflotta,
  UpdateDittaIndividuale,
} from "../thunks/admin";
import {
  Admin,
  AdminInitialState,
  AdminSettingInfo,
  AdminSettingsForm,
  AdminSettingsResponse,
  DriverData,
  SingleCityRoute,
  SingleDriverInfo,
  SingleHotelOrder,
} from "../../TSModels/Admin";
import { HotelData } from "../../TSModels/Hotel";
const InitialHotelData = {
  _id: "",
  email: "",
  surname: "",
  companyName: "",
  piva: "",
  address: "",
  city: "",
  pec: "",
  sdi: "",
  name: "",
};
const InitialDriverData = {
  _id: "",
  carType: 0,
  driverName: "",
  driverSurname: "",
  targa: "",
  module: "",
  cityOfService: "",
  licenseNumber: "",
};
const initialState: AdminInitialState = {
  isLoading: false,
  isWeeklyLoading: false,
  isSuccess: false,
  isUpdatedLoading: false,
  hotelData: InitialHotelData,
  driverData: InitialDriverData,
  AllCityRoutes: [],
  AllDriverInfo: [],
  AllHotelOrders: [],
  adminSettings: {} as AdminSettingsForm,
  singleAdmin: {} as AdminSettingInfo,
  weeklyCost: [],
  CategoriesList: [],
  deleteLoading: false,
  deleteSuccess: false,
    addDriverloading:false,
  addDriverSuccess:false,
  updateDriverLoading:false,
  updateDriverSuccess:false,
  AllCapoflotta: [],
  AllDittaIndividuale: [],
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteSuccess = false;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
    resetHotelData: (state) => {
      state.hotelData = InitialHotelData;
      state.driverData = InitialDriverData;
    },
    resetDriverData: (state) => {
      state.driverData = InitialDriverData;
      state.hotelData = InitialHotelData;
    },
       resetDriverState: (state) => {
      state.updateDriverLoading = false;
      state.updateDriverSuccess = false;
       state.addDriverSuccess = false;
      state.addDriverloading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(AddNewDriverInfo.pending, (state) => {
      state.addDriverSuccess = false;
      state.addDriverloading = true;
    });
    builder.addCase(AddNewDriverInfo.fulfilled, (state) => {
      state.addDriverloading = false;
      state.addDriverSuccess = true;
    });
    builder.addCase(AddNewDriverInfo.rejected, (state) => {
      state.addDriverSuccess = false;
      state.addDriverloading = false;
    });
    builder.addCase(UpdateDriverInfo.pending, (state) => {
      state.updateDriverSuccess = false;
      state.updateDriverLoading = true;
    });
    builder.addCase(UpdateDriverInfo.fulfilled, (state) => {
      state.updateDriverLoading = false;
      state.updateDriverSuccess = true;
    });
    builder.addCase(UpdateDriverInfo.rejected, (state) => {
      state.updateDriverSuccess = false;
      state.updateDriverLoading = false;
    });
    builder.addCase(DeleteDriverInfo.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(DeleteDriverInfo.fulfilled, (state) => {
      state.isUpdatedLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(DeleteDriverInfo.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(GetAllDriverInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      GetAllDriverInfo.fulfilled,
      (state, action: PayloadAction<SingleDriverInfo[]>) => {
        state.isLoading = false;
        state.AllDriverInfo = action.payload;
      }
    );
    builder.addCase(GetAllDriverInfo.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(AddNewCityRoute.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      AddNewCityRoute.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(AddNewCityRoute.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(UpdateCityRoute.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      UpdateCityRoute.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(UpdateCityRoute.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(DeleteCityRoute.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      DeleteCityRoute.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(DeleteCityRoute.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(AllCityRoutes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      AllCityRoutes.fulfilled,
      (state, action: PayloadAction<SingleCityRoute[]>) => {
        state.isLoading = false;
        state.AllCityRoutes = action.payload;
      }
    );
    builder.addCase(AllCityRoutes.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(AllHotelOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      AllHotelOrders.fulfilled,
      (state, action: PayloadAction<SingleHotelOrder[]>) => {
        state.isLoading = false;
        state.AllHotelOrders = action.payload;
      }
    );
    builder.addCase(AllHotelOrders.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSingleHotelInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getSingleHotelInfo.fulfilled,
      (state, action: PayloadAction<HotelData>) => {
        state.isLoading = false;
        state.hotelData = action.payload;
      }
    );
    builder.addCase(getSingleHotelInfo.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSingleDriverInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getSingleDriverInfo.fulfilled,
      (state, action: PayloadAction<DriverData>) => {
        state.isLoading = false;
        state.driverData = action.payload;
      }
    );
    builder.addCase(getSingleDriverInfo.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getAdminSettings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getAdminSettings.fulfilled,
      (state, action: PayloadAction<AdminSettingsForm>) => {
        state.isLoading = false;
        state.adminSettings = action.payload;
      }
    );
    builder.addCase(getAdminSettings.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(saveAdminSettings.pending, (state) => {
      state.isLoading = true;
      // state.isSuccess = false;
    });
    builder.addCase(saveAdminSettings.fulfilled, (state, _action) => {
      state.isLoading = false;
      // state.isSuccess = true;
    });
    builder.addCase(saveAdminSettings.rejected, (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(getAdminSingleSettings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getAdminSingleSettings.fulfilled,
      (state, action: PayloadAction<AdminSettingsResponse>) => {
        state.isLoading = false;
        state.singleAdmin = action.payload.AdminSettingInfo;
      }
    );
    builder.addCase(getAdminSingleSettings.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(GetDriverWeeklyCost.pending, (state) => {
      state.isWeeklyLoading = true;
    });
    builder.addCase(
      GetDriverWeeklyCost.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.weeklyCost = action.payload.data;
        state.isWeeklyLoading = false;
      }
    );
    builder.addCase(GetDriverWeeklyCost.rejected, (state) => {
      state.isWeeklyLoading = false;
    });

    builder.addCase(getAllCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.CategoriesList = action.payload; // or action.payload.data, depending on your API
    });

    builder.addCase(getAllCategories.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(CreateCategory.pending, (state) => {
      state.isUpdatedLoading = true;
      state.isSuccess = false;
    });

    builder.addCase(CreateCategory.fulfilled, (state) => {
      state.isUpdatedLoading = false;
      state.isSuccess = true;
    });

    builder.addCase(CreateCategory.rejected, (state) => {
      state.isUpdatedLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteCategory.pending, (state) => {
      state.deleteLoading = true;
      state.deleteSuccess = false;
    });

    builder.addCase(deleteCategory.fulfilled, (state) => {
      state.deleteLoading = false;
      state.deleteSuccess = true;
    });

    builder.addCase(deleteCategory.rejected, (state) => {
      state.deleteLoading = false;
      state.deleteSuccess = false;
    });
    builder.addCase(CreateCapoflotta.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(CreateCapoflotta.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(CreateCapoflotta.rejected, (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(CreateDittaIndividuale.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(CreateDittaIndividuale.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(CreateDittaIndividuale.rejected, (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(GetAllCapoflotta.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      GetAllCapoflotta.fulfilled,
      (state, action: PayloadAction<Admin[]>) => {
        state.isLoading = false;
        state.AllCapoflotta = action.payload || [];
      }
    );
    builder.addCase(GetAllCapoflotta.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(UpdateCapoflotta.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(UpdateCapoflotta.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(UpdateCapoflotta.rejected, (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(GetAllDittaIndividuale.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      GetAllDittaIndividuale.fulfilled,
      (state, action: PayloadAction<Admin[]>) => {
        state.isLoading = false;
        state.AllDittaIndividuale = action.payload || [];
      }
    );
    builder.addCase(GetAllDittaIndividuale.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(UpdateDittaIndividuale.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(UpdateDittaIndividuale.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(UpdateDittaIndividuale.rejected, (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    });
  },
});
// Actions
export const adminActions = adminSlice.actions;
// Selectors

export const SelectAllCategories = (state: RootState) => {
  return state.admin.CategoriesList;
};
export const SelectCategoryloading = (state: RootState) => {
  return state.admin.deleteLoading;
};
export const SelectCategorySuccess = (state: RootState) => {
  return state.admin.deleteSuccess;
};
export const SelectIsLoading = (state: RootState) => {
  return state.admin.isLoading;
};
export const selectSuccess = (state: RootState) => {
  return state.admin.isSuccess;
};
export const selectIsUpdatedLoader = (state: RootState) => {
  return state.admin.isUpdatedLoading;
};
export const SelectAllCityRoutes = (state: RootState) => {
  return state.admin.AllCityRoutes;
};
export const SelectAllDriverInfo = (state: RootState) => {
  return state.admin.AllDriverInfo;
};
export const SelectSingleHotelInfo = (state: RootState) => {
  return state.admin.hotelData;
};
export const SelectSingleDriverInfo = (state: RootState) => {
  return state.admin.driverData;
};
export const SelectAllHotelOrders = (state: RootState) => {
  return state.admin.AllHotelOrders;
};
export const SelectAdminSettings = (state: RootState) => {
  return state.admin.adminSettings;
};
export const SelectSingleAdminData = (state: RootState) => {
  return state.admin.singleAdmin;
};
export const SelectWeeklyData = (state: RootState) => {
  return state.admin.weeklyCost;
};
export const SelectWeeklyLoading = (state: RootState) => {
  return state.admin.isWeeklyLoading;
};
export const SelectAddDriverLoading = (state: RootState) => {
  return state.admin.addDriverloading;
};
export const SelectAddDoctorSuccess = (state: RootState) => {
  return state.admin.addDriverSuccess;
};export const SelectUpdateDriverLoading = (state: RootState) => {
  return state.admin.updateDriverLoading;
};
export const SelectUpdateDriverSuccess = (state: RootState) => {
  return state.admin.updateDriverSuccess;
};
export const SelectAllCapoflotta = (state: RootState) => {
  return state.admin.AllCapoflotta;
};
export const SelectAllDittaIndividuale = (state: RootState) => {
  return state.admin.AllDittaIndividuale;
};
// Reducer
const adminReducer = adminSlice.reducer;
export default adminReducer;


