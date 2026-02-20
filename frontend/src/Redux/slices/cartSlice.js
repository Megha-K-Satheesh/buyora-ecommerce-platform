
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userProductsService } from "../../services/productsService";

export const mergeCart = createAsyncThunk('cart/mergeCart',
  async(_,thunkAPI)=>{
        try {
            const guestCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (guestCart.length === 0) return []; // nothing to merge
            const res = await userProductsService.mergeCart(guestCart)

              localStorage.removeItem("cart");
               return res.data.data;
        } catch (err) {
          return thunkAPI.rejectWithValue(err || "merge cart failed")
        }
  }
)

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (variationId, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // Guest → remove from localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = cart.filter((x) => x.variationId !== variationId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }

      // Logged-in → API
      const res = await userProductsService.removeFromCart(variationId);
      return res.data.data; // backend cart
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Remove from cart failed");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ variationId, quantity }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // Guest → localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const item = cart.find((x) => x.variationId === variationId);
        if (item) item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        return cart;
      }

     
      const res = await userProductsService.updateCartQuantity(variationId, quantity);
      return res.data.data; // backend cart
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Update quantity failed");
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState:{
    cartItems: [],
  loading: false,
  error: null,
  },
  reducers: {
    // update the Redux cart state with the latest cart data from backend
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },

    // Add to cart (UI state only)
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find(
        (x) =>
          x.productId === item.productId &&
          x.variationId === item.variationId
      );

      if (existItem) {
        existItem.quantity += 1;
      } else {
        state.cartItems.push(item);
      }
       localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    // Clear cart (for logout)
    clearCart: (state) => {
      state.cartItems = [];
    },
  },

  extraReducers: (builder) => {
  builder
    .addCase(mergeCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(mergeCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload; // backend cart is now source of truth
    })
    .addCase(mergeCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
     .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
}

});

export const { addToCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
