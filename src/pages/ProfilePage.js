import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { config } from "../Constants";
const url = config.url.API_URL;

const ProfilePage = () => {
    const { accessToken, loading } = useSelector((state) => state.user);
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [orders, setOrders] = useState([]);
    //const [loading, setLoading] = useState(false);

    const years = Array.from({ length: 3 }, (_, index) => currentYear - index);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    console.log("selected year", selectedYear);
    /*
    useEffect(() => {
        console.log("useEffect is running with selectedYear:", selectedYear);
        const retrieveData = async () => {
            setLoading(true);
            try {
                const access = localStorage.getItem("access");
                const res = await fetch(
                    `${url}/order-year?year=${selectedYear}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${access}`,
                        },
                        credentials: "include",
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.user_year_orders_serializer);
                    console.log("order year data", data);
                }
            } catch (err) {
                console.log("Error", err);
            } finally {
                setLoading(false);
            }
        };

        retrieveData();
    }, [selectedYear]);
    */

    const retrieveOrderByYear = useCallback(async () => {
        try {
            const access = localStorage.getItem("access");
            console.log("Access token:", access);
            const res = await fetch(`${url}/order-year?year=${selectedYear}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${access}`,
                },
                credentials: "include",
            });
            console.log("Response status:", res.status);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.user_year_orders_serializer);
                console.log("order year data", data);
            } else {
                console.log("Request failed with status:", res.status);
                const errorData = await res.json(); // Attempt to parse the error response
                console.log("Error data:", errorData);
                // Add more error handling if needed
            }
        } catch (err) {
            console.log("Error", err);
        }
    }, [selectedYear]);

    useEffect(() => {
        console.log("useEffect triggered");
        if (accessToken) {
            console.log("Calling retrieveOrderByYear");
            retrieveOrderByYear();
        }
    }, [accessToken, retrieveOrderByYear]);

    return (
        <div>
            <div className="profile-page-main-div">
                {loading && <p>Loading ...</p>}
                <div className="profile-page-selector-div">
                    <label htmlFor="yearSelector">Select a year:</label>
                    <select
                        id="yearSelector"
                        className="year-selector"
                        key={selectedYear}
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
                        {Array.isArray(years) && years.length > 0 ? (
                            years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))
                        ) : (
                            <option value="">No years available.</option>
                        )}
                    </select>
                </div>
                {!loading && orders.length > 0 && (
                    <div>
                        {orders ? (
                            <div>
                                <div className="profile-page-order-main-section">
                                    <div>
                                        <div className="profile-page-order-main-div">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="profile-page-order-loop-div"
                                                >
                                                    <div className="profile-page-order-header">
                                                        <div className="profile-page-header-order-details">
                                                            <div className="profile-page-single-header-detail">
                                                                <div>
                                                                    <span>
                                                                        Order
                                                                        Placed
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        Date
                                                                        Placed
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="profile-page-single-header-detail">
                                                                <div>
                                                                    <span>
                                                                        Total
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        {
                                                                            order.get_cart_total
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="profile-page-single-header-detail">
                                                                <div>
                                                                    <span>
                                                                        Ship To
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        {
                                                                            order.first_name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="profile-page-order-num-div">
                                                                <div className="profile-page-single-header-detail">
                                                                    <div>
                                                                        <span>
                                                                            Item
                                                                            Order
                                                                            Number
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="profile-page-single-header-detail">
                                                                    <span>
                                                                        {
                                                                            order.id
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="profile-page-single-header-detail">
                                                                {order.all_order_items_returned ===
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
                                                                            to={`/return-order/${order.id}`}
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
                                                    {order.order_items.map(
                                                        (item) => {
                                                            return (
                                                                <div>
                                                                    <div className="profile-page-order-detail-body">
                                                                        <img
                                                                            className=" profile-page-order-image order-detail-body-child"
                                                                            src={
                                                                                item
                                                                                    .product_detail
                                                                                    .image
                                                                            }
                                                                            alt={
                                                                                item
                                                                                    .product_detail
                                                                                    .name
                                                                            }
                                                                        />
                                                                        <div className="order-detail-body-child">
                                                                            {
                                                                                item
                                                                                    .product_detail
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                        <div className="order-detail-body-child">
                                                                            {
                                                                                item
                                                                                    .product_detail
                                                                                    .description
                                                                            }
                                                                        </div>
                                                                        <div className="order-detail-body-child">
                                                                            Qty.{" "}
                                                                            {
                                                                                item.quantity
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
                )}
            </div>
            {!loading && orders && orders.length === 0 && (
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
