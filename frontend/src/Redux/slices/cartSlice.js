
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userProductsService } from "../../services/productsService";


  export const addToCartBackend = createAsyncThunk('cart/addToCartBackend',async(data,thunkAPI)=>{
      try {
         const  res = await userProductsService.addToCart(data)
             return res.data.data
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message||"cart add to backend") 
      }
  })


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

export const getCartBackend = createAsyncThunk(
  "cart/getCartBackend",
  async (_, thunkAPI) => {
    try {
      const res = await userProductsService.getCart(); 
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (variationId, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
       
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = cart.filter((x) => x.variationId !== variationId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }

   
      const res = await userProductsService.removeFromCart(variationId);
      return res.data.data; 
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
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.map(item =>
    item.variationId === variationId ? { ...item, quantity } : item
  );
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return updatedCart;
}

     
      const res = await userProductsService.updateCartQuantity(variationId, quantity);
      console.log(res)
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Update quantity failed");
    }
  }
);





export const verifyCoupon = createAsyncThunk(
  "cart/verifyCoupon",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userProductsService.verifyCoupon(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Coupon verification failed"
      );
    }
  }
);

export const removeCouponBackend = createAsyncThunk(
  "cart/removeCouponBackend",
  async (_, thunkAPI) => {
    try {
      const res = await userProductsService.removeCoupon();
      return res.data.data;   
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to remove coupon"
      );
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState:{
    cartItems: [],
     appliedCoupon: null,
  discountAmount: 0,
  finalAmount: 0,
  isApplied:false,
  loading: false,
  error: null,
  },
  reducers: {
   
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },

  
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

  
    clearCart: (state) => {
      state.cartItems = [];
    },


     clearCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    
     state.error = null;
      state.isApplied = false;     }
  },

  extraReducers: (builder) => {
  builder
    .addCase(mergeCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(mergeCart.fulfilled, (state, action) => {
      state.loading = false;
     state.cartItems = action.payload?.items ||action.payload|| [];

     state.appliedCoupon = null;
  state.discountAmount = 0;
  state.finalAmount = 0;
  state.isApplied = false;
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
        state.cartItems = action.payload?.items ||action.payload|| [];
          state.appliedCoupon = action.payload?.appliedCoupon || null;
  state.discountAmount = action.payload?.discountAmount || 0;
  state.finalAmount = action.payload?.finalAmount || 0;
    state.isApplied = !!action.payload.appliedCoupon;
       
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
        state.cartItems = action.payload?.items ||action.payload|| [];

        state.appliedCoupon = action.payload?.appliedCoupon || null;
  state.discountAmount = action.payload?.discountAmount || 0;
  state.finalAmount = action.payload?.finalAmount || 0;
    state.isApplied = !!action.payload.appliedCoupon;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartBackend.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(addToCartBackend.fulfilled, (state, action) => {
    state.loading = false;
    state.cartItems = action.payload?.items ||action.payload|| [];
      state.appliedCoupon = action.payload?.appliedCoupon || null;
  state.discountAmount = action.payload?.discountAmount || 0;
  state.finalAmount = action.payload?.finalAmount || 0;
  state.isApplied = !!action.payload?.appliedCoupon;
  })
  .addCase(addToCartBackend.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  .addCase(getCartBackend.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getCartBackend.fulfilled, (state, action) => {
    state.loading = false;
    state.cartItems = action.payload?.items ||action.payload|| []; 
    
state.appliedCoupon = action.payload?.appliedCouponCode || null;
state.discountAmount = action.payload?.discountAmount || 0;
state.finalAmount = action.payload?.finalAmount || 0;

  state.isApplied = !!action.payload?.appliedCouponCode;

  console.log("from redux cartSlice",action.payload?.appliedCoupon || null)
  })
  .addCase(getCartBackend.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
   .addCase(verifyCoupon.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
  
      
        .addCase(verifyCoupon.fulfilled, (state, action) => {
          state.loading = false;
          state.appliedCoupon= action.payload.appliedCoupon;
          state.discountAmount = action.payload.discountAmount;
          state.finalAmount = action.payload.finalAmount;
        state.isApplied = !!action.payload.appliedCoupon;
        })
  
        .addCase(verifyCoupon.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.appliedCoupon = null;
          state.discountAmount = 0;
          state.finalAmount = 0;
          state.isApplied = false;
        })


.addCase(removeCouponBackend.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(removeCouponBackend.fulfilled, (state, action) => {
  state.loading = false;

  state.cartItems = action.payload.items;
  state.appliedCoupon = null;
  state.discountAmount = 0;
  state.finalAmount = action.payload.finalAmount;
  state.isApplied = false;
})

.addCase(removeCouponBackend.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
}

});

export const { addToCart, setCart, clearCart ,clearCoupon} = cartSlice.actions;
export default cartSlice.reducer;









