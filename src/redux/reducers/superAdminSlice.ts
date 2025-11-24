import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SuperAdminInitialState } from "../../TSModels/SuperAdmin";
import {
  AllHotelsList,
  CreateNewAdmin,
  CreateNewCity,
  DeleteAdmin,
  DeleteAdminCity,
  GetAllAdminCity,
  GetAllAdmins,
  GetAllCityWithAdmin,
  GetBuisnessInfo,
  UpdateAdminData,
  UpdateCityData,
} from "../thunks/superAdmin";
import { SingleHotel } from "../../TSModels/Admin";

const initialState: SuperAdminInitialState = {
  isLoading: false,
  isSuccess: false,
  isUpdatedLoading: false,
  AllAdminsList: [],
  AllCityList: [],
  AllHotelInfo: [],
  BuisnessInfo: null,
  CityWithAdmin: [],
  CityWithAdminLoading:false,
  CityWithAdminSuccess:false,

};

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    resetsuperAdminStates: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CreateNewAdmin.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      CreateNewAdmin.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(CreateNewAdmin.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(UpdateAdminData.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      UpdateAdminData.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(UpdateAdminData.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(DeleteAdmin.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      DeleteAdmin.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(DeleteAdmin.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(GetAllAdmins.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      GetAllAdmins.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.AllAdminsList = action.payload;
      }
    );
    builder.addCase(GetAllAdmins.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(GetAllAdminCity.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      GetAllAdminCity.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.AllCityList = action.payload;
      }
    );

    builder.addCase(GetAllAdminCity.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(GetAllCityWithAdmin.pending, (state) => {
      state.CityWithAdminLoading = true;
      state.CityWithAdminSuccess=false;
    });

    builder.addCase(
      GetAllCityWithAdmin.fulfilled,
      (state, action) => {
        state.CityWithAdminLoading = false;
        state.CityWithAdmin = action.payload;
        state.CityWithAdminSuccess=true;
      }
    );

    builder.addCase(GetAllCityWithAdmin.rejected, (state) => {
      state.CityWithAdminLoading = false;
      
    });

    builder.addCase(CreateNewCity.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      CreateNewCity.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(CreateNewCity.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(UpdateCityData.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      UpdateCityData.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(UpdateCityData.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(DeleteAdminCity.pending, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = true;
    });
    builder.addCase(
      DeleteAdminCity.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isUpdatedLoading = false;
      }
    );
    builder.addCase(DeleteAdminCity.rejected, (state) => {
      state.isSuccess = false;
      state.isUpdatedLoading = false;
    });
    builder.addCase(AllHotelsList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      AllHotelsList.fulfilled,
      (state, action: PayloadAction<SingleHotel[]>) => {
        state.isLoading = false;
        state.AllHotelInfo = action.payload;
      }
    );
    builder.addCase(AllHotelsList.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(GetBuisnessInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      GetBuisnessInfo.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.BuisnessInfo = action.payload;
      }
    );
    builder.addCase(GetBuisnessInfo.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Actions
export const superAdminActions = superAdminSlice.actions;

// Selectors
export const selectSuccess = (state: RootState) => {
  return state.superAdmin.isSuccess;
};
export const selectIsLoading = (state: RootState) => {
  return state.superAdmin.isLoading;
};
export const selectAllAdminList = (state: RootState) => {
  return state.superAdmin.AllAdminsList;
};
export const selectAllCityList = (state: RootState) => {
  return state.superAdmin.AllCityList;
};
export const selectAllCityListWithAdmin = (state: RootState) => {
  return state.superAdmin.CityWithAdmin;
};

export const SelectAllHotelInfo = (state: RootState) => {
  return state.superAdmin.AllHotelInfo;
};
export const SelectBuisnessInfo = (state: RootState) => {
  return state.superAdmin.BuisnessInfo;
};
export const SelectIsUpdatedLoading = (state: RootState) => {
  return state.superAdmin.isUpdatedLoading;
};
// Reducer
const superAdminReducer = superAdminSlice.reducer;
export default superAdminReducer;
