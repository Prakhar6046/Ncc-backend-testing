import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../utilities/api.service";
import { normalFailMsg, successMsg } from "../../utilities/utils";

export const handlePayment = createAsyncThunk(
  "api/handlePayment",
  async (payload: any, thunkAPI) => {
    try {
      const response = await ApiService.postData(
        "payment/order-payment",
        payload
      );
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
