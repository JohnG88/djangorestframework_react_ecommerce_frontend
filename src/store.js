import { configureStore } from "@reduxjs/toolkit";

// import reducers
import userReducer from "./features/auth/userSlice";
import cartReducer from "./features/cart/cartSlice";


export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
});
