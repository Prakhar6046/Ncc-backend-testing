import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  AllCarModels,
  CreateCarModel,
  DeleteCarModel,
  UpdateCarModel,
} from "../thunks/admin";
import { CarModelInitialState } from "../../TSModels/Admin";

const initialState: CarModelInitialState = {
  isLoading: false,
  isSuccess: false,
  createSuccess: false,
  createLoading: false,
  allCarModelsInfo: [],
  deleteSuccess: false,
  deleteLoading: false,
};

const carModelSlice = createSlice({
  name: "carModel",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
    resetDeleteState: (state) => {
      state.deleteSuccess = false;
      state.deleteLoading = false;
    },
        resetCreateState: (state) => {
      state.createLoading = false;
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CreateCarModel.pending, (state) => {
      state.createSuccess = false;
      state.createLoading = true;
    });
    builder.addCase(CreateCarModel.fulfilled, (state) => {
      state.createLoading = false;
      state.createSuccess = true;
    });
    builder.addCase(CreateCarModel.rejected, (state) => {
      state.createSuccess = false;
      state.createLoading = false;
    });
    builder.addCase(UpdateCarModel.pending, (state) => {
      state.isSuccess = false;
      state.isLoading = true;
    });
    builder.addCase(UpdateCarModel.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(UpdateCarModel.rejected, (state) => {
      state.isSuccess = false;
    });
    builder.addCase(DeleteCarModel.pending, (state) => {
      state.deleteSuccess = false;
      state.deleteLoading = true;
    });
    builder.addCase(DeleteCarModel.fulfilled, (state) => {
      state.deleteLoading = false;
      state.deleteSuccess = true;
    });
    builder.addCase(DeleteCarModel.rejected, (state) => {
      state.deleteSuccess = false;
      state.deleteLoading = false;
    });
    builder.addCase(AllCarModels.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      AllCarModels.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allCarModelsInfo = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(AllCarModels.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Actions
export const carModelActions = carModelSlice.actions;

// Selectors
export const SelectIsLoading = (state: RootState) => {
  return state.carModel.isLoading;
};
export const SelectIsSuccess = (state: RootState) => {
  return state.carModel.isSuccess;
};
export const SelectIsCreateLoading = (state: RootState) => {
  return state.carModel.createLoading;
};
export const SelectIsCreateSuccess = (state: RootState) => {
  return state.carModel.createSuccess;
};
export const SelectIsDeleteLoading = (state: RootState) => {
  return state.carModel.deleteLoading;
};
export const SelectIsDeleteSuccess = (state: RootState) => {
  return state.carModel.deleteSuccess;
};
export const SelectAllCarModelInfo = (state: RootState) => {
  return state.carModel.allCarModelsInfo;
};

// Reducer
const carModelReducer = carModelSlice.reducer;
export default carModelReducer;
