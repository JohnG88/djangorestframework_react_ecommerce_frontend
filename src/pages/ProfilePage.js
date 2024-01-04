/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getUser } from "../features/auth/userSlice";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((store) => store.user) || {};
    console.log("orders ", orders);
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState("");

    const years = Array.from({ length: 3 }, (_, index) => currentYear - index);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    useEffect(() => {
        if (selectedYear) {
            dispatch(getUser(selectedYear));
        }
    }, [dispatch, selectedYear]);
    /*
    // Reset selectedYear when orders change
    useEffect(() => {
        if (orders && orders.length > 0) {
            // Find the unique years in the updated orders
            const uniqueYears = Array.from(
                new Set(
                    orders.map((item) =>
                        new Date(item.order_date).getFullYear()
                    )
                )
            );

            // Reset selectedYear to the first year in the updated orders
            setSelectedYear(uniqueYears[0]);
        }
    }, []);
    */

    
    // Reset selectedYear when orders change
    useEffect(() => {
        // If orders change and selectedYear is not part of the new orders, reset selectedYear
        if (orders && orders.length > 0 && !orders.some((item) => item.year === selectedYear)) {
            // Reset selectedYear to the year of the first order in the updated orders
            setSelectedYear(new Date(orders[0].order_date).getFullYear());
        }
    }, []);
    

    return (
        <div>
            <div className="profile-page-main-div">
                {orders ? (
                    <div>
                        <div className="profile-page-order-main-section">
                            <div>
                                <div className="profile-page-order-main-div">
                                    <div className="profile-page-selector-div">
                                        <label htmlFor="yearSelector">
                                            Select a year:
                                        </label>
                                        <select
                                            id="yearSelector"
                                            className="year-selector"
                                            value={String(selectedYear)}
                                            onChange={handleYearChange}
                                        >
                                            {/**
                                            {years.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                             */}
                                            {Array.isArray(years) &&
                                            years.length > 0 ? (
                                                years.map((year) => (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">
                                                    No years available.
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    {orders.map((item) => (
                                        <div
                                            key={item.id}
                                            className="profile-page-order-loop-div"
                                        >
                                            <div className="profile-page-order-header">
                                                <div className="profile-page-header-order-details">
                                                    <div className="profile-page-single-header-detail">
                                                        <div>
                                                            <span>
                                                                Order Placed
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                Date Placed
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="profile-page-single-header-detail">
                                                        <div>
                                                            <span>Total</span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {
                                                                    item.get_cart_total
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="profile-page-single-header-detail">
                                                        <div>
                                                            <span>Ship To</span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {
                                                                    item.first_name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="profile-page-order-num-div">
                                                        <div className="profile-page-single-header-detail">
                                                            <div>
                                                                <span>
                                                                    Item Order
                                                                    Number
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="profile-page-single-header-detail">
                                                            <span>
                                                                {item.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="profile-page-single-header-detail">
                                                        {item.all_order_items_returned ===
                                                        true ? (
                                                            <div className="returned-items-btn-div">
                                                                <span className="bg bg-danger items-returned-badge">
                                                                    Items
                                                                    Returned
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <Link
                                                                    to={`/return-order/${item.id}`}
                                                                >
                                                                    <button className="btn btn-primary">
                                                                        Return
                                                                        Order
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {item.order_items.map(
                                                (innerItem) => {
                                                    return (
                                                        <div>
                                                            <div
                                                                key={
                                                                    innerItem.id
                                                                }
                                                                className="profile-page-order-detail-body"
                                                            >
                                                                <img
                                                                    className=" profile-page-order-image order-detail-body-child"
                                                                    src={
                                                                        innerItem
                                                                            .product_detail
                                                                            .image
                                                                    }
                                                                />
                                                                <div className="order-detail-body-child">
                                                                    {
                                                                        innerItem
                                                                            .product_detail
                                                                            .name
                                                                    }
                                                                </div>
                                                                <div className="order-detail-body-child">
                                                                    {
                                                                        innerItem
                                                                            .product_detail
                                                                            .description
                                                                    }
                                                                </div>
                                                                <div className="order-detail-body-child">
                                                                    Qty.{" "}
                                                                    {
                                                                        innerItem.quantity
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
            {orders && orders.length === 0 && (
                <div className="main-profile-page-no-orders">
                    <div className="profile-page-no-orders-div">
                        <h4>No orders for this year.</h4>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
