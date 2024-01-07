import React, { useEffect, useCallback } from "react";
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

import { useDispatch, useSelector } from "react-redux";

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

    const getUserCallback = useCallback(() => {
        if (accessToken) {
            //const currentYear = new Date().getFullYear();
            dispatch(getUser());
        }
    }, [dispatch, accessToken]);

    const updateTokenCallback = useCallback(() => {
        if (loading) {
            dispatch(updateToken());
        }
    }, [dispatch, loading]);

    const intervalCallback = useCallback(() => {
        if (refreshToken) {
            dispatch(updateToken());
        }
    }, [dispatch, refreshToken]);

    useEffect(() => {
        if (accessToken) {
            getUserCallback();
        }
    }, [accessToken, getUserCallback]);

    useEffect(() => {
        
        updateTokenCallback();

        const fourMinFiftySecs = 1000 * 20;
        //const fourMinFiftySecs = 1000 * (4 * 60 + 30);
        const interval = setInterval(intervalCallback, fourMinFiftySecs);

        return () => clearInterval(interval);
    }, [updateTokenCallback, intervalCallback, refreshToken]);

    return (
        <Elements stripe={stripePromise}>
            <div className="body-container">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<ProductPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        {/*}<Route path="/products" element={<ProductPage />}/>
                        */}
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
