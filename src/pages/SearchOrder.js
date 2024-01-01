import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchOrder = () => {
    const [formData, setFormData] = useState({
        email: "",
        orderNumber: "",
    });
    const [order, setOrder] = useState();

    const { email, orderNumber } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/search-order?email=${email}&orderNumber=${orderNumber}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("order search data", data);
            setOrder(data);
        } catch (error) {
            console.log(
                "There was a problem with the fetch operation: ",
                error
            );
        }
    };

    return (
        <React.Fragment>
            <div className="return-order-main-div">
                <h2>Search for Order to Return</h2>
                <div className="return-order-form-div">
                    <form
                        className="mt-5 return-order-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={email}
                                required
                            />
                        </div>
                        <div className="form-group search-order-number-div mt-3">
                            <label className="form-label" htmlFor="orderNumber">
                                Order Number
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="orderNumber"
                                onChange={handleChange}
                                value={orderNumber}
                                required
                            />
                        </div>
                        <div className="return-order-btn-div">
                            <button className="btn btn-primary">
                                Search for Order
                            </button>
                        </div>
                    </form>
                </div>

                {order ? (
                    <div className="found-order-main-section">
                        <div>
                            <div className="found-order-main-div">
                                <div className="order-number-text-div">
                                    <h2 className="order-number-text">
                                        Order Number {order.id}
                                    </h2>
                                </div>
                                {order.order_items.map((order_item) => {
                                    return (
                                        <div
                                            key={order_item.id}
                                            className="found-order-loop-div"
                                        >
                                            <div className="found-order-header">
                                                <div className="header-order-details">
                                                    <div className="single-header-detail">
                                                        <div>
                                                            <span>
                                                                Ordered Placed
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                Date placed
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="single-header-detail">
                                                        <div>
                                                            <span>Total</span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                $
                                                                {(
                                                                    order_item.quantity *
                                                                    order_item
                                                                        .product_detail
                                                                        .price
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="single-header-detail">
                                                        <div>
                                                            <span>Ship To</span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {
                                                                    order.first_name
                                                                }{" "}
                                                                {
                                                                    order.last_name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="found-order-num-div">
                                                    <div className="single-header-detail">
                                                        <span>
                                                            Item Order Number
                                                        </span>
                                                    </div>
                                                    <div className="single-header-detail">
                                                        <span>
                                                            {order_item.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="found-order-details"
                                                key={order_item.id}
                                            >
                                                <img
                                                    className="order-found-img found-order-details-child"
                                                    src={
                                                        order_item
                                                            .product_detail
                                                            .image
                                                    }
                                                    alt={order_item.name}
                                                />
                                                <div className="found-order-details-child">
                                                    <h5>
                                                        {
                                                            order_item
                                                                .product_detail
                                                                .name
                                                        }
                                                    </h5>
                                                </div>
                                                <div className="found-order-details-child">
                                                    <h6>
                                                        {
                                                            order_item
                                                                .product_detail
                                                                .description
                                                        }
                                                    </h6>
                                                </div>
                                                <div className="found-order-details-child">
                                                    <h6>
                                                        Amount ordered:{" "}
                                                        {order_item.quantity}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {order.all_order_items_returned === true ? (
                            <>
                                <h5>All Items have been returned</h5>
                            </>
                        ) : (
                            <>
                                <Link to={`/return-order/${order.id}`}>
                                    <button className="btn btn-primary">
                                        Return Order
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    ""
                )}
            </div>
        </React.Fragment>
    );
};

export default SearchOrder;
