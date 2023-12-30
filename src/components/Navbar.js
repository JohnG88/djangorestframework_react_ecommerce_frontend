import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/userSlice";
import { clearCart } from "../features/cart/cartSlice";
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, username } = useSelector((state) => state.user);

    //const username = jwt_decode(localStorage.getItem("access"))
    const accessToken = localStorage.getItem("access");
    const [accessTokenUsername, setAccessTokenUsername] = useState(() =>
        accessToken ? jwt_decode(accessToken) : null
    );

    //const username = jwt_decode(accessToken)
    console.log("userSlice username", username);

    const { cartItems } = useSelector((store) => store.cart);

    //if (!user || !user.customer || !user.customer.user) {
    //    return null
    //}
    //const username = user.customer.user.username

    //console.log("navbar user", user)

    const handleLogoutClearCart = () => {
        dispatch(logout());
        dispatch(clearCart());

        navigate("/");
    };

    /*
    if (cartItems === []) {
        return <Navigate to="/" />
    }
    */

    const authLinks = (
        <React.Fragment>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a
                        className="nav-link"
                        href="#!"
                        onClick={() => handleLogoutClearCart()}
                    >
                        Logout
                    </a>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">
                        {username}
                    </NavLink>
                </li>
                {/*
            {username ? (
                <li className="nav-item">
                    <a className="nav-link" href="!#">
                        {username}
                    </a>
                </li>
            ) : (
                ""
            )}
            */}
                {/*
            {user && user.customer && user.customer.user && (
                <li className="nav-item">
                <a className="nav-link" href="#!">
                    {user.customer.user.username}
                </a>
            </li>
            )}
            */}
            </ul>
        </React.Fragment>
    );

    const guestLinks = (
        <div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                        Register
                    </NavLink>
                </li>
            </ul>
        </div>
    );

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Auth Site
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>

                        <NavLink className="nav-link" to="/order-container">
                            Cart
                        </NavLink>
                        <NavLink className="nav-link" to="/search-order">
                            Search for Order
                        </NavLink>
                    </ul>
                    <div className="ms-auto">
                        {accessToken ? authLinks : guestLinks}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
