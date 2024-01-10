import React, { useEffect } from "react";
import CartItem from "./OrderItem";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
//import { getCartItems, calculateTotals } from "./features/cart/cartSlice";

import {
    getCartItems,
    calculateTotals,
} from "../features/cart/cartSlice";

const OrderContainer = () => {
    const { cartItems, total } = useSelector(
        (store) => store.cart
    );
    
    const dispatch = useDispatch();
    
    /*
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getCartItems());
            dispatch(getCartItems());
        }
        fetchData()
        
    }, [dispatch]);
    */
    

    
    useEffect(() => {
        dispatch(getCartItems());
    }, [dispatch]);
    
    
    
    useEffect(() => {
        dispatch(calculateTotals());
        //dispatch(redirectIfEmptyCart());
    }, [cartItems, dispatch]);
    
    

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
