import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { setAccessToken } from "../auth/userSlice";

//const url = "http://127.0.0.1:8000/order";
const url2 = "http://127.0.0.1:8000/update-order-item";
const url3 = "http://127.0.0.1:8000/delete-order-item";

const initialState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading: true,
};

function getAccessTokenFromLocalStorage() {
    return localStorage.getItem("access")
}

export const getCartItems = createAsyncThunk(
    "cart/getCartItems",
    async (_, { getState }) => {
        try {
            const accessTokenFromLocalStorage = getAccessTokenFromLocalStorage()
            console.log("accessTokenFromLocalStorage", accessTokenFromLocalStorage)
            
            //const access = localStorage.getItem("access");
            const userInfo = setAccessToken(getState());
            
            /*
            console.log(
                "cart slice get items access",
                userInfo.payload.user.accessToken
            );
            */

            const access = accessTokenFromLocalStorage || userInfo.payload.user.accessToken;
            console.log("order access", access)

            const resp = await axios.get("http://127.0.0.1:8000/order", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(access && {
                        Authorization: `Bearer ${access}`,
                    }),
                },
                credentials: "include",
                withCredentials: true,
            });
            console.log("order resp data", resp.data)
            const cartItems = resp.data.order_items;
            console.log("cartItem", cartItems)
            //localStorage.setItem("cartItems", JSON.stringify(cartItems))
            return resp.data;
        } catch (error) {
            return console.log("get cart items error", error);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ itemId, quantity }, {getState}) => {
        try {
            const accessTokenFromLocalStorage = getAccessTokenFromLocalStorage()
            console.log("accessTokenFromLocalStorage", accessTokenFromLocalStorage)

            const userInfo = setAccessToken(getState());

            console.log(
                "cart slice update items access",
                userInfo.payload.user.accessToken
            );

            const access = accessTokenFromLocalStorage || userInfo.payload.user.accessToken;


            //const access = localStorage.getItem("access");
            const resp = await axios.patch(
                `${url2}/${itemId}`,
                { quantity },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(access && {
                            Authorization: `Bearer ${access}`,
                        }),
                    },
                    credentials: "include",
                    withCredentials: true,
                }
            );
            return resp.data;
        } catch (error) {}
    }
);


export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ itemId}, {getState }) => {
        try {
            const accessTokenFromLocalStorage = getAccessTokenFromLocalStorage()
            
            const userInfo = setAccessToken(getState());
            
            
            //console.log(
            //    "cart slice delete items access",
            //    userInfo.payload.user.accessToken
            //);

            const access = accessTokenFromLocalStorage || userInfo.payload.user.accessToken;
            //const access = localStorage.getItem("access");
            const resp = await axios.delete(`${url3}/${itemId}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(access && {
                        Authorization: `Bearer ${access}`,
                    }),
                },
                credentials: "include",
                withCredentials: true,
            });
            return resp.data;
        } catch (error) {}
    }
);


/*
export const redirectIfEmptyCart = createAsyncThunk("cart/redirectIfEmptyCart", async (_, {getState, dispatch}) => {
    const {cart} = getState();
    console.log("cart", cart)
    
    if (cart.cartItems.length === 0) {
        dispatch(clearCart())
    }
}
)
*/

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
            state.amount = 0;
            state.total = 0;
            state.isLoading = true;
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== itemId
            );
            state.amount = 0;
            state.total = 0;
            state.isLoading = true;
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find(
                (item) => item.id === payload.id
            );
            cartItem.quantity = cartItem.quantity + 1;
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find(
                (item) => item.id === payload.id
            );
            cartItem.quantity = cartItem.quantity - 1;
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            if (state.cartItems && state.cartItems.length > 0) {
                state.cartItems.forEach((item) => {
                    //console.log(item.product_detail.price)
                    amount += item.quantity;
                    total += item.quantity * item.product_detail.price;
                });
            }

            state.amount = amount;
            state.total = total;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCartItems.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCartItems.fulfilled, (state, action) => {
            console.log("getCartItems fulfilled action", action);
            
            if (action.payload && action.payload.id) {
                state.orderId = action.payload.id;
                state.cartItems = action.payload.order_items;
            } else {
                console.log("Invalid payload structure in getCartItems.fulfilled")
            }
            state.isLoading = false;
            
            //state.amount = action.payload.quantity
            //state.amount = action.payload.quantity
            //dispatch(calculateTotals())
        });
        builder.addCase(getCartItems.rejected, (state, action) => {
            console.log("rejected", action);
            state.isLoading = false;
        });
        builder.addCase(updateCartItem.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            //Update the cart state with the updated item
            state.isLoading = false;
            const updatedItem = action.payload;
            const updatedCartItems = state.cartItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            );
            state.cartItems = updatedCartItems;
            //localStorage.removeItem("cartItems")
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        });
        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.isLoading = false;
        });
        
        builder.addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCartItem.fulfilled, (state, action) => {
            console.log(action);
            console.log(state.cartItems);
            state.isLoading = false;
            // Remove the item from the cart state
            const itemId = action.payload.id;
            console.log(itemId);
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== itemId
            );
        });
        builder.addCase(deleteCartItem.rejected, (state, action) => {
            state.isLoading = false;
        });
        
    },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
    cartSlice.actions;

export default cartSlice.reducer;
