import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "../../Constants";

const url = config.url.API_URL

const initialState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    username: null,
    user: null,
    loading: false,
    registered: false,
};

function getAccessTokenFromLocalStorage() {
    return localStorage.getItem("access");
}

const mergeGuestCartToUserCart = async (access, id) => {
    try {
        const response = await fetch(`${url}/merge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
            },
            body: JSON.stringify({ guest_cart_order_number: id }),
            credentials: "include",
        });

        const data = await response.json();
        console.log("data from merge", data);
    } catch (error) {
        console.log("Error", error);
    }
};

export const register = createAsyncThunk(
    "user/register",
    async ({ username, email, password }, thunkAPI) => {
        const body = JSON.stringify({
            username,
            email,
            password,
        });

        try {
            const res = await fetch(`${url}/register`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body,
            });

            const data = await res.json();

            if (res.status === 201) {
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const getUser = createAsyncThunk("users/me", async (year, thunkAPI) => {
    try {
        //const validYear = year || "";
        const access = localStorage.getItem("access");
        const res = await fetch(`${url}/user?year=${year}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access}`,
            },
        });

        const data = await res.json();
        console.log("getUser data", data);

        if (res.status === 200) {
            return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const login = createAsyncThunk(
    "user/login",
    async ({ username, password }, thunkAPI) => {
        const body = JSON.stringify({
            username,
            password,
        });

        try {
            const res = await fetch(`${url}/token`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body,
            });

            const data = await res.json();
            console.log("login data", data);

            if (res.status === 200) {
                const access = data.access;
                const refresh = data.refresh;

                localStorage.setItem("refresh", refresh);
                localStorage.setItem("access", access);

                console.log(
                    "thunkAPI getState() cart orderId",
                    thunkAPI.getState().cart.orderId
                );

                const orderId = thunkAPI.getState().cart.orderId;
                const { dispatch } = thunkAPI;
                dispatch(getUser());

                try {
                    await mergeGuestCartToUserCart(access, orderId);
                } catch (mergeError) {
                    console.log("Merge Error", mergeError);
                }

                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

/*
export const verify = createAsyncThunk("user/verify", async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const body = JSON.stringify({
        token: token,
    });
    try {
        const res = await fetch("http://127.0.0.1:8000/verify", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body,
        });

        const data = await res.json();

        if (res.status === 200) {
            const { dispatch } = thunkAPI;
            dispatch(getUser());

            return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});
*/

/*
export const verify = createAsyncThunk("user/verify", async (_, thunkAPI) => {
    const access = localStorage.getItem("access");
    const body = JSON.stringify({
        access: access,
    });

    try {
        const res = await fetch("http://127.0.0.1:8000/verify", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body,
        });

        const data = await res.json();

        if (res.status === 200) {
            const { dispatch } = thunkAPI;
            dispatch(getUser());
            return data;
        } else if (res.status === 401) {
            // Attempt to refresh the token using the refresh token
            const refresh = localStorage.getItem("refresh");
            const refreshBody = JSON.stringify({
                refresh: refresh,
            });

            const refreshRes = await fetch(
                "http://127.0.0.1:8000/refresh",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: refreshBody,
                }
            );

            const refreshData = await refreshRes.json();
            console.log("refresh data", refreshData)

            if (refreshRes.status === 200) {
                // Refresh successful, update the access token in local storage
                const newToken = refreshData.access;
                localStorage.setItem("access", newToken);

                // Retry the original request with the new access token
                const retryRes = await fetch("http://127.0.0.1:8000/verify", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${newToken}`,
                        
                        // Include the new access token in the header
                    },
                    body,
                });

                const retryData = await retryRes.json();

                if (retryRes.status === 200) {
                    const { dispatch } = thunkAPI;
                    dispatch(getUser());
                    return retryData;
                } else {
                    return thunkAPI.rejectWithValue(retryData);
                }
            } else {
                // Refresh failed, reject the original request with the refresh data
                return thunkAPI.rejectWithValue(refreshData);
            }
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});
*/

/*
export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token")
    }
})
*/

export const updateToken = createAsyncThunk(
    "user/updateToken",
    async (_, thunkAPI) => {
        //console.log("get state function", getState())
        //const { refreshToken } = thunkAPI.getState().user;
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");

        try {
            const response = await fetch(`${url}/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            const data = await response.json();

            if (response.status === 200) {
                thunkAPI.dispatch(setAccessToken(data.access));
                localStorage.setItem("access", data.access);
                // If you need to dispatch the setUser action, you can do it here.
                // dispatch(setUser(jwt_decode(data.access)));
            } else {
                // If the token refresh fails, you might want to handle this situation.
                // For now, let's just log out the user.
                thunkAPI.dispatch(logout());
            }

            /*
        if (loading) {
            dispatch(setLoading(false));
        }
        */
        } catch (error) {
            console.log(error.message);
            // You might want to dispatch an action to handle the error state.
            // dispatch(setContextError(error.message));
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },

        logout: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.username = null;
            state.user = null;
            state.orders = null;
            state.registered = false;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
            state.registered = true;
        });
        builder.addCase(register.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            //console.log("login fulfilled action", action);
            state.loading = false;
            state.accessToken =
                action.payload.access || getAccessTokenFromLocalStorage();
            state.refreshToken = action.payload.refresh;
            state.isAuthenticated = true;
        });
        builder.addCase(login.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            console.log(
                "getUser action",
                action.payload.customer.user.username
            );
            console.log("getUser action orders ", action.payload)
            state.loading = false;
            state.username = action.payload.customer.user.username;
            state.user = action.payload;
            state.orders = action.payload.user_orders
        });
        builder.addCase(getUser.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateToken.fulfilled, (state, action) => {
            // If the updateToken action is successful, the state should already be updated.
            // You may not need to do anything specific here, depending on your application's logic.
            //state.loading = false
            //state.accessToken = action.payload
            state.isAuthenticated = true;
        });
        builder.addCase(updateToken.rejected, (state) => {
            // If the updateToken action fails, you might want to handle this situation.
            // For now, let's just log out the user.
            state.loading = false;
            state.accessToken = null;
            state.refreshToken = null;
        });
        /*
            .addCase(verify.pending, (state) => {
                state.loading = true;
            })
            .addCase(verify.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(verify.rejected, (state) => {
                state.loading = false;
                localStorage.removeItem("token");
            });
            */
    },
});

export const { logout, setAccessToken, setRefreshToken } = userSlice.actions;
export default userSlice.reducer;
