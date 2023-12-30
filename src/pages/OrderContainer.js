import React, { useEffect, useState } from "react";
import CartItem from "./OrderItem";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate, Navigate } from "react-router-dom";
//import { getCartItems, calculateTotals } from "./features/cart/cartSlice";

import {
    getCartItems,
    calculateTotals,
    redirectIfEmptyCart,
    clearCart,
} from "../features/cart/cartSlice";

const OrderContainer = () => {
    const { cartItems, total, amount, isLoading } = useSelector(
        (store) => store.cart
    );
    const { isAuthenticated } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    const token = localStorage.getItem("token");

    console.log("cart items in order container", cartItems);

    console.log("amount", amount);

    useEffect(() => {
        dispatch(getCartItems());
        /*
        dispatch(getCartItems()).then(() => {
            dispatch(calculateTotals());
            setIsLoaded(true);
        });
        */
    }, []);

    /*
    useEffect(() => {
        dispatch(getCartItems());
    }, [dispatch]);
    */

    useEffect(() => {
        dispatch(calculateTotals());
        //dispatch(redirectIfEmptyCart());
    }, [cartItems]);

    /*
    if (isLoading) {
        return (
            <div className="loading">
                <h1>Loading</h1>
            </div>
        );
    }
    */
    
    /*
    if (isLoading) {
        // Introduce a 1-second delay
        setTimeout(() => {
            return (
                <div className="loading">
                    <h1>Loading</h1>
                </div>
            );
        }, 1000); // Adjust the delay time as needed
    }
    */

    /*
    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }
    */

    /*
    useEffect(() => {
        if (cartItems.length === 0) {
            dispatch(redirectIfEmptyCart());
            //navigate("/login")
        }
    }, [cartItems, dispatch]);

    useEffect(() => {
        const handleNavigation = () => {
            if (cartItems.length === 0) {
                dispatch(clearCart());
                navigate("/login");
            }
        };

        handleNavigation();
    }, [cartItems, dispatch, navigate]);
    */

    /*
    if (amount < 1) {
        return (
            <section className="cart">
                <header>
                    <h2>Your Bag</h2>
                    <h4 className="empty-cart">is currently empty</h4>
                </header>
            </section>
        )
    }
    */

    if (!cartItems || cartItems.length === 0) {
        return (
            <section className="cart">
                <header>
                    <h2>your bag</h2>
                    <h4 className="empty-cart">is currently empty</h4>
                </header>
                <div>
                    <h4>
                        <Link to="/">Add Some Items</Link>
                    </h4>
                </div>
            </section>
        );
    }

    return (
        <section className="cart">
            <header>
                <h2>your bag</h2>
            </header>
            <div>
                {cartItems.map((item) => {
                    return <CartItem key={item.id} {...item} />;
                })}
            </div>
            <footer>
                <hr />
                <div className="cart-total">
                    <h4>
                        total <span>${total.toFixed(2)}</span>
                    </h4>
                </div>
                <Link to="/submit-order">Checkout</Link>
            </footer>
        </section>
    );
};

export default OrderContainer;
