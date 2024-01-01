import React, { useEffect } from "react";
//import dotenv from 'dotenv'
//import { useDispatch } from "react-redux";
//import { verify } from "./features/auth/userSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import OrderContainer from "./pages/OrderContainer";

import RegisterPage from "./pages/RegisterPage";
import LoginForm from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

import ProductPage from "./pages/ProductPage";
import DetailPage from "./pages/DetailPage";
import SubmitOrderPage from "./pages/SubmitOrderPage";
import SearchOrder from "./pages/SearchOrder";

import PurchasedOrderDetails from "./pages/PurchasedOrderDetails";
import PartialOrderReturn from "./pages/PartialOrderReturn";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"

//import { isTokenExpired, refreshAccessToken } from "./utils/tokenManager";

import { useDispatch, useSelector } from "react-redux";
//import { calculateTotals, getCartItems } from "./features/cart/cartSlice";

import { updateToken, getUser } from "./features/auth/userSlice";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

//dotenv.config()

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user);
    //const loading = useSelector((state) => state.user.loading)

    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    
    console.log("accessToken", accessToken);
    //const refreshToken = localStorage.getItem("refresh")

    useEffect(() => {
        if (accessToken) {
            dispatch(getUser());
        }

        if (loading) {
            dispatch(updateToken());
        }

        
        //const fourMinFiftySecs = 1000 * 20;
        const fourMinFiftySecs = 1000 * (4 * 60 + 30);
        const interval = setInterval(() => {
            if (refreshToken) {
                dispatch(updateToken());
            }
        }, fourMinFiftySecs);

        return () => clearInterval(interval);
    }, [dispatch, accessToken, loading, refreshToken]);

    /*
    //const {cartItems} = useSelector((store) => store.cart)

    // Function to refresh the access token and update it in local storage and Redux store
    const handleTokenRefresh = async () => {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                localStorage.setItem("access", newAccessToken);
                //dispatch(setUserToken(newAccessToken)); // Update the token in Redux store if you're using Redux
            } catch (error) {
                // Handle the refresh token failure (e.g., logout the user)
                console.error("Token refresh failed:", error);
            }
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");

        // Check if access token is expired or close to expiration (within a threshold)
        if (isTokenExpired(accessToken)) {
            // If the token is expired, try refreshing the token
            handleTokenRefresh();
        } else if (refreshToken) {
            // If the token is not expired but there's a refresh token, schedule a refresh before the access token expires
            const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
            const expiration = tokenData.exp * 1000; // Convert expiration time to milliseconds
            const timeUntilExpiration = expiration - Date.now();
            const threshold = 20 * 1000;
            //const threshold = 5 * 60 * 1000;
             // Set a threshold of 5 minutes (adjust as needed)

            if (timeUntilExpiration < threshold) {
                // If the token will expire within the threshold, schedule a refresh
                const refreshTimer = setTimeout(
                    handleTokenRefresh,
                    timeUntilExpiration
                );
                return () => clearTimeout(refreshTimer);
            }
        }
    }, [dispatch]);
    */

    /*
  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems])
  

  useEffect(() => {
    dispatch(getCartItems())
  }, [])
  */

    return (
        <Elements stripe={stripePromise}>
            <div className="body-container">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<ProductPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        {/*}<Route path="/products" element={<ProductPage />}/>*/}
                        <Route path="/profile" element={<ProfilePage />}/>
                        <Route
                            path="/detail/:detailId"
                            element={<DetailPage />}
                        />
                        <Route
                            path="/order-container"
                            element={<OrderContainer />}
                        />
                        <Route
                            path="/submit-order"
                            element={<SubmitOrderPage />}
                        />
                        <Route
                            path="/purchased-order-details"
                            element={<PurchasedOrderDetails />}
                        />
                        <Route
                            path="/search-order"
                            element={<SearchOrder />}
                        />
                        <Route
                            path="/return-order/:orderId"
                            element={<PartialOrderReturn />}
                        />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </div>
        </Elements>
    );
}

export default App;
