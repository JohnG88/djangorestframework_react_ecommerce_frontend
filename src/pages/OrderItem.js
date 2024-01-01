import React from "react";
import { ChevronDown, ChevronUp } from "../icons";
import {
    updateCartItem,
    deleteCartItem,
} from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

/*
export const CartItem = ({id, quantity, product_detail}) => {
    const dispatch = useDispatch()

    const handleQuantityChange = (newQuantity) => {
        dispatch(updateCartItem({itemId: id, quantity: newQuantity}))
    }

    const handleDeleteCartItem = (quantity) => {
        console.log("delete")
        dispatch(deleteCartItem({itemId: id}))
    }

    return (
        <article className="cart-item">
            <div>
                <img src={product_detail.image} alt={product_detail.name} />
                <h4>{product_detail.name}</h4>
                <h4 className="item-price">{product_detail.price}</h4>
                <button className="remove-btn" onClick={() => {
                    handleDeleteCartItem()
                }}>
                    remove
                </button>
            </div>
            <div>
                <button className="amount-btn" onClick={() => {
                    handleQuantityChange(quantity + 1)
                }}>
                    <ChevronUp />
                </button>
                <p className="amount">{quantity}</p>
                <button className="amount-btn" onClick={() => {
                    if (quantity === 1) {
                        handleDeleteCartItem()
                        return
                    }
                    handleQuantityChange(quantity - 1)
                }}>
                    <ChevronDown />
                </button>
            </div>
        </article>
    )
}
*/

export const CartItem = ({ id, quantity, product_detail }) => {
    const dispatch = useDispatch();

    const handleQuantityChange = (newQuantity) => {
        dispatch(updateCartItem({ itemId: id, quantity: newQuantity }));
    };

    //'quantity' in ()
    const handleDeleteCartItem = () => {
        console.log("delete");
        dispatch(deleteCartItem({ itemId: id }));
        
    };

    const handleIncreaseClick = (event) => {
        event.preventDefault(); // Prevent page refresh
        handleQuantityChange(quantity + 1);
    };

    const handleDecreaseClick = (event) => {
        event.preventDefault(); // Prevent page refresh
        if (quantity === 1) {
            handleDeleteCartItem();
        } else {
            handleQuantityChange(quantity - 1);
        }
    };

    return (
        <article className="cart-item">
            <div className="item-details">
                <img src={product_detail.image} alt={product_detail.name} />

                <h4>{product_detail.name}</h4>

                <h4 className="item-price">{product_detail.price}</h4>
                <button
                    className="remove-btn"
                    onClick={() => {
                        handleDeleteCartItem();
                    }}
                >
                    remove
                </button>
            </div>
            <div>
                <button
                    type="button"
                    className="amount-btn"
                    onClick={handleIncreaseClick}
                >
                    <ChevronUp />
                </button>
                <p className="amount">{quantity}</p>
                <button
                    type="button"
                    className="amount-btn"
                    onClick={handleDecreaseClick}
                >
                    <ChevronDown />
                </button>
            </div>
        </article>
    );
};

export default CartItem;
