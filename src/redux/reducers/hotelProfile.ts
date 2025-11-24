import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  handleDeleteHotel,
  handleGetCompanyData,
  handleGetHotelOrders,
  handleUpdateCompanyData,
  RequestService,
} from "../thunks/hotel";
import {
  GetHotelResponse,
  HotelInitialState,
  SingleHotelOrder,
} from "../../TSModels/Hotel";
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

const initialState: HotelInitialState = {
  isLoading: false,
  isSuccess: false,
  hotelData: InitialHotelData,
  hotelOrders: [],
  isDelete: false,
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    resetHotelState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleUpdateCompanyData.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(
      handleUpdateCompanyData.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isSuccess = action.payload.status;
        state.isLoading = false;
      }
    );
    builder.addCase(handleUpdateCompanyData.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(handleGetCompanyData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handleGetCompanyData.fulfilled,
      (state, action: PayloadAction<GetHotelResponse>) => {
        state.isLoading = false;
        state.hotelData = action.payload.data;
      }
    );
    builder.addCase(handleGetCompanyData.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(handleDeleteHotel.pending, (state) => {
      state.isDelete = false;
    });
    builder.addCase(
      handleDeleteHotel.fulfilled,
      (state, _action: PayloadAction<any>) => {
        state.isDelete = true;
      }
    );
    builder.addCase(handleDeleteHotel.rejected, (state) => {
      state.isDelete = false;
    });
    builder.addCase(handleGetHotelOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      handleGetHotelOrders.fulfilled,
      (state, action: PayloadAction<SingleHotelOrder[]>) => {
        state.isLoading = false;
        state.hotelOrders = action.payload;
      }
    );
    builder.addCase(handleGetHotelOrders.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(RequestService.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(
      RequestService.fulfilled,
      (state, _action: PayloadAction<any>) => {
        state.isLoading = false;
        // state.hotelOrders = action.payload;
        state.isSuccess = true;
      }
    );
    builder.addCase(RequestService.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Actions
export const hotelActions = hotelSlice.actions;

// Selectors
export const selectSuccess = (state: RootState) => {
  return state.hotel.isSuccess;
};
export const selectIsLoading = (state: RootState) => {
  return state.hotel.isLoading;
};
export const selectHotelData = (state: RootState) => {
  return state.hotel.hotelData;
};
export const selectHotelOrders = (state: RootState) => {
  return state.hotel.hotelOrders;
};
export const selectIsDelete = (state: RootState) => {
  return state.hotel.isDelete;
};
// Reducer
const hotelReducer = hotelSlice.reducer;
export default hotelReducer;
