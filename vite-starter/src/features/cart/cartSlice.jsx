import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


const url = "https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

// export const getCartItems = createAsyncThunk("cart/getCartItems", async () => {
//   try {
//     const res = await fetch(url, { mode: 'no-cors' });
//     return await res.json();
//   } catch (err) {
//     console.log(err);
//   }
// });

export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (_, thunkAPI) => {
    try {
      const resp = await axios(url);
      return resp.data;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount > 0 ? cartItem.amount - 1 : 0;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total.toFixed(2);
    },
  },
  // extraReducers: {
  //   [getCartItems.pending]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getCartItems.fulfilled]: (state, action) => {
  //     state.cartItems = action.payload;
  //     state.isLoading = false;
  //   },
  //   [getCartItems.pending]: (state) => {
  //     state.isLoading = false;
  //   },
  // },
   extraReducers: (builder) => {
      builder
        .addCase(getCartItems.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getCartItems.fulfilled, (state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload;
        })
        .addCase(getCartItems.rejected, (state, action) => {
          console.log(action);
          state.isLoading = false;
        });
    },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
