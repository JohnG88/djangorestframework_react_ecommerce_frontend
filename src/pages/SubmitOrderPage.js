import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCartItems,
    calculateTotals,
} from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import {
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import { clearCart } from "../features/cart/cartSlice";

import BillingAddressForm from "../modals/BillingAddressModal";

import { config } from "../Constants";

const url = config.url.API_URL;

const SubmitOrderPage = () => {
    const { username } = useSelector((state) => state.user);

    const stripe = useStripe();
    const elements = useElements();

    const { cartItems, total } = useSelector((store) => store.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formEditable, setFormEditable] = useState(false);
    const inputRef = useRef(null);

    const fresnoTaxRate = (7.98 / 100).toFixed(4);

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        streetAddress: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
    });

    const [billingAddress, setBillingAddress] = useState(null);

    const [isChecked, setIsChecked] = useState(true);
    const [toggleLinks, setToggleLinks] = useState(true);
    const [toggleEditButton, setToggleEditButton] = useState(false);
    const [editSaveButtonToggle, setEditSaveButtonToggle] = useState(true);

    const [error, setError] = useState("");
    
    useEffect(() => {
        dispatch(getCartItems());
        //getShippingBillingAddress();

        if (username != null) {
            getShippingBillingAddress();
        }

        if (username === null) {
            setFormEditable(true);
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 500);
        }
    }, [username, dispatch]);

    useEffect(() => {
        dispatch(calculateTotals());
    }, [cartItems, dispatch]);
    

    const {
        id,
        firstName,
        lastName,
        email,
        streetAddress,
        apt,
        city,
        state,
        zipcode,
    } = formData;

    const handleEditClick = () => {
        //Enable editing of form fields
        setFormEditable(true);

        // Use setTimeout to ensure that the focus is set after the disabled property is updated
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleEditSaveButtonToggle = () => {
        if (editSaveButtonToggle === true) {
            setEditSaveButtonToggle(false);
        } else {
            setEditSaveButtonToggle(true);
            setFormEditable(false);
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
        if (isChecked === false) {
            setToggleEditButton(false);
        } else {
            setToggleEditButton(true);
        }
    };

    //console.log("is checked", isChecked);

    const getShippingBillingAddress = async (e) => {
        //e.preventDefault();

        const access = localStorage.getItem("access");

        const response = await fetch(
            `{url}/billing-shipping-address`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Address data ", data.shipping_address);
            const shippingAddress = data.shipping_address;
            //console.log("shipping address id", shippingAddress.id)

            const billingAddress = data.billing_address;
            setBillingAddress(billingAddress);
            console.log("billing address ", billingAddress);

            if (shippingAddress === undefined) {
                setFormEditable(true);
                setToggleLinks(false);
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }, 500);
            }

            if (shippingAddress) {
                setFormData({
                    id: shippingAddress.id,
                    firstName: shippingAddress.first_name,
                    lastName: shippingAddress.last_name,
                    email: shippingAddress.customer_detail.email,
                    streetAddress: shippingAddress.street_address,
                    apt: shippingAddress.apt,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    zipcode: shippingAddress.zipcode,
                });
            }
        }
    };

    const updateShippingBillingAddress = async (formData, addressType) => {
        const access = localStorage.getItem("access");

        const {
            id,
            firstName,
            lastName,
            email,
            streetAddress,
            apt,
            city,
            state,
            zipcode,
        } = formData;

        const response = await fetch(
            `${url}/edit-shipping-billing`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`,
                },
                body: JSON.stringify({
                    id: id,
                    address_type: addressType,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    street_address: streetAddress,
                    apt: apt,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                }),
            }
        );

        if (response.ok) {
            // Address updated successfully
            // You can handle success feedback to the user if needed
            const data = await response.json();
            console.log("updated address data ", data);
        } else {
            // Handle the case where the update fails.
        }
    };

    const submitOrder = async (e) => {
        e.preventDefault();
        const card = elements.getElement(CardElement);

        try {
            const { paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: card,
            });

            if (paymentMethod && paymentMethod.id) {
                const access = localStorage.getItem("access");

                const response = await fetch(
                    `${url}/submit-order`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(access && {
                                Authorization: `Bearer ${access}`,
                            }),
                        },
                        credentials: "include",
                        withCredentials: true,

                        body: JSON.stringify({
                            payment_method_id: paymentMethod.id,
                            id: id,
                            address_type: "shipping",
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                            street_address: streetAddress,
                            apt: apt,
                            city: city,
                            state: state,
                            zipcode: zipcode,
                            is_checked: isChecked,
                            total_with_tax:
                                parseFloat(total) +
                                parseFloat((total * fresnoTaxRate).toFixed(2)),
                        }),
                    }
                );

                const data = await response.json();
                console.log("payment intent data", data);

                if (response.ok) {
                    setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        streetAddress: "",
                        apt: "",
                        city: "",
                        state: "",
                        zipcode: "",
                    });
                    setIsChecked(false);
                    dispatch(clearCart());
                    navigate("/purchased-order-details", {
                        state: { data: data.order },
                    });
                } else {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setError("An unexpected error occurred.");
                    }
                }
            } else {
                // Handle the case where 'paymentMethod.id' is not available
                console.error("Payment method 'id' is missing");
            }
        } catch (error) {
            // Handle any errors that might occur during payment method creation or API request
            console.log("Error creating payment method: " + error.message);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "19px",
                color: "#32325d",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#fa755a",
            },
        },
    };
    // Base 6%, CA has mandatory 1.25% local rate
    // CA state tax rate 7.25%
    // Fresno, CA, is 7.98%

    return (
        <section>
            <BillingAddressForm
                username={username}
                show={showModal}
                handleClose={closeModal}
                billingAddress={billingAddress}
                updateShippingBillingAddress={updateShippingBillingAddress}
            />{" "}
            <div className="submit-order-main-div">
                <div className="order-details-submit-div">
                    {cartItems.length === 0 ? (
                        <div className="no-item-submit-div">
                            <h3>No Items to Purchase</h3>
                            
                            <div>
                                <h4>
                                    <Link to="/">Add Some Items</Link>
                                </h4>
                            </div>
                            
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="outer-submit-order-div mb-4"
                                    >
                                        <div className="submit-order-details">
                                            <img
                                                className="submit-order-img"
                                                src={item.product_detail.image}
                                                alt={item.product_detail.name}
                                            />
                                            <h5>{item.product_detail.name}</h5>
                                            <p>Qty. {item.quantity}</p>
                                            <p>
                                                Price{" "}
                                                {item.product_detail.price}
                                            </p>
                                            {/**
                                            <button
                                                className="remove-btn"
                                                onClick={() => {
                                                    handleDeleteCartItem(
                                                        item.id
                                                    );
                                                }}
                                            >
                                                remove
                                            </button>
                                             */}
                                        </div>
                                        <hr />
                                    </div>
                                );
                            })}
                            <div className="order-total-and-warning-div">
                                <div className="order-total-tax order-total-warning-child">
                                    <div className="order-price">
                                        <span>Items cost</span>{" "}
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="order-price">
                                        <span>Estimated Taxes</span>{" "}
                                        <span>
                                            $
                                            {(total * fresnoTaxRate).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="order-price">
                                        <span>Total </span>
                                        <span>
                                            $
                                            {parseFloat(total) +
                                                parseFloat(
                                                    (
                                                        total * fresnoTaxRate
                                                    ).toFixed(2)
                                                )}
                                        </span>
                                    </div>
                                </div>
                                {error && (
                                    <div className="order-total-tax order-total-warning-child warning-div">
                                        <p>{error}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="submit-order-form-div">
                    <form className="submit-order-form" onSubmit={submitOrder}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                className="form-control"
                                type="text"
                                name="firstName"
                                ref={inputRef}
                                onChange={handleChange}
                                value={firstName}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                                value={lastName}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="email"
                                onChange={handleChange}
                                value={email}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label
                                className="form-label"
                                htmlFor="streetAddress"
                            >
                                Street Address
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="streetAddress"
                                onChange={handleChange}
                                value={streetAddress}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="apt">
                                Apt
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="apt"
                                onChange={handleChange}
                                value={apt}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="city">
                                City
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="city"
                                onChange={handleChange}
                                value={city}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="state">
                                State
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="state"
                                onChange={handleChange}
                                value={state}
                                required
                                disabled={!formEditable}
                            />
                        </div>
                        <div className="form-group mt-3 mb-4">
                            <label className="form-label" htmlFor="zipcode">
                                Zipcode
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                name="zipcode"
                                onChange={handleChange}
                                value={zipcode}
                                required
                                disabled={!formEditable}
                            />
                        </div>

                        <div className="form-group billing-checkbox-main-div mb-3">
                            <div>
                                {" "}
                                <span className="billing-span-text">
                                    Is Billing the same as Shipping
                                </span>
                            </div>
                            <div>
                                <label className="checkbox-label-1">
                                    <input
                                        type="checkbox"
                                        name="checkboxBilling"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        className="large-checkbox"
                                    />
                                    <span className="checkmark-2"></span>
                                </label>
                            </div>

                            {username && formData && (
                                <>
                                    {toggleLinks && (
                                        <>
                                            {editSaveButtonToggle && (
                                                <div>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            handleEditClick();
                                                            handleEditSaveButtonToggle();
                                                        }}
                                                    >
                                                        Edit Shipping Address
                                                    </button>
                                                </div>
                                            )}
                                            {!editSaveButtonToggle && (
                                                <>
                                                    <div>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                updateShippingBillingAddress(
                                                                    formData,
                                                                    "shipping"
                                                                );
                                                                handleEditSaveButtonToggle();
                                                            }}
                                                        >
                                                            Save Shipping
                                                            Address
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={
                                                                handleEditSaveButtonToggle
                                                            }
                                                        >
                                                            Cancel Edit
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {toggleEditButton && (
                                <>
                                    <div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={openModal}
                                        >
                                            Edit Billing Address
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="form-group pt-3 mb-4">
                            <CardElement
                                options={cardElementOptions}
                                id="card-element"
                            />
                        </div>
                        {/**
                        <div className="form-group pt-3 mb-4">
                            <CardElement />
                        </div>
                        */}
                        <div className="mb-3">
                            <button className="submit-order-btn">
                                Place Order
                            </button>
                        </div>
                        
                        {/*
                        <div>
                            <button
                                type="button"
                                class="btn btn-primary"
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                            >
                                Launch demo modal
                            </button>
                        </div>
                        */}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SubmitOrderPage;
