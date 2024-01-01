//import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState, useCallback } from "react";
//import { ToastContainer, toast } from 'react-toastify';

import { useParams } from "react-router-dom";

const PartialOrderReturn = () => {
    const params = useParams();
    const orderId = params.orderId;
    //toast.configure();

    const [order, setOrder] = useState();

    const [returningData, setReturningData] = useState([]);

    const [submissionStatus, setSubmissionStatus] = useState(null);

    const [itemReturnedData, setItemReturnedData] = useState(null);

    const getOrder = useCallback(async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/return-partial-order/${orderId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            //if (!response.ok) {
            //    throw new Error("API request failed.");
            // }
            const data = await response.json();
            console.log("partial return order data", data);
            setOrder(data);
        } catch (error) {
            console.log("Error", error);
        }
    }, [orderId]);

    
    useEffect(() => {
        getOrder();
    }, [getOrder]);

    /*
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/return-partial-order/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ order_items: returningData }), // Include returningData in the request body
                }
            );

            if (!response.ok) {
                throw new Error("API request failed.");
            }

            const data = await response.json();
            console.log("partial return order data", data);
            //setOrder(data);
        } catch (error) {
            console.log("Error", error);
        }
    };
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (returningData.length === 0) {
            console.log(
                "No data has been entered. Please fill in the input fields."
            );
            return;
        }

        let isValidationError = false; // Track if any validation error occurred

        // Iterate through each order item and check the return quantity
        for (const order_item of order.order_items) {
            const item = returningData.find(
                (item) => item.order_item_id === order_item.id
            );
            const returnQuantity = item
                ? parseInt(item.item_amount_returning)
                : 0;
            const availableQuantity =
                order_item.quantity - order_item.item_amount_returning;

            if (returnQuantity > availableQuantity) {
                // If return quantity exceeds available quantity for any item, set an error flag
                isValidationError = true;
            }
        }

        if (!isValidationError) {
            try {
                // Submit the data
                const response = await fetch(
                    `http://127.0.0.1:8000/return-partial-order/${orderId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ order_items: returningData }),
                    }
                );

                if (!response.ok) {
                    throw new Error("API request failed.");
                }

                const data = await response.json();
                console.log("partial return order data", data);
                setSubmissionStatus("success");
                setItemReturnedData(data.updated_items);
            } catch (error) {
                console.log("Error", error);
            }
        } else {
            // Handle the validation error here, e.g., display a message or prevent submission
            console.log(
                "Validation error: Amount exceeds the available items you can return."
            );
        }
    };

    const handleAmountChange = (orderItemId, value) => {
        console.log("handleAmountChange called with: ", orderItemId, value);
        // Check if order item is already in array
        const existingItemIndex = returningData.findIndex(
            (item) => item.order_item_id === orderItemId
        );

        if (value === 0) {
            // Remove the item from returningData if the value is "0"
            if (existingItemIndex !== -1) {
                const updatedItems = [...returningData];
                updatedItems.splice(existingItemIndex, 1);
                setReturningData(updatedItems);
            }
        } else {
            if (existingItemIndex !== -1) {
                const updatedItems = [...returningData];
                updatedItems[existingItemIndex].item_amount_returning = value;
                setReturningData(updatedItems);
            } else {
                // If the item doesn't exist add it to the array
                setReturningData((prevReturningData) => [
                    ...prevReturningData,
                    {
                        order_item_id: orderItemId,
                        item_amount_returning: value,
                    },
                ]);
            }
        }
    };

    //const upDateReturnItem = (orderItemId) => {
    //    setReturningData((prevReturningItems) => [
    //        ...prevReturningItems,
    //        { id: orderItemId, item_amount_returning: null },
    //    ]);
    //};

    return (
        <React.Fragment>
            {submissionStatus === null && (
                <>
                    <h3 className="pt-5">What items to return</h3>
                    {order ? (
                        <div>
                            <div className="main-order-return-form-div">
                                {order.order_items.map((order_item) => {
                                    console.log(
                                        "Initial order_item.id:",
                                        order_item.id
                                    );
                                    console.log(
                                        "Initial order_item.item_amount_returning:",
                                        order_item.item_amount_returning
                                    );

                                    return (
                                        <div
                                            key={order_item.id}
                                            className="order-details-div"
                                        >
                                            <img
                                                src={
                                                    order_item.product_detail
                                                        .image
                                                }
                                                className="return-order-img order-details-div-child"
                                                alt={
                                                    order_item.product_detail
                                                        .name
                                                }
                                            />
                                            <div className="order-details-div-child">
                                                <h4>
                                                    {
                                                        order_item
                                                            .product_detail.name
                                                    }
                                                </h4>
                                            </div>
                                            <div className="order-details-div-child">
                                                <h5>Amount ordered </h5>
                                                <p> {order_item.quantity}</p>
                                            </div>
                                            <div>
                                                <h5>Available to Return</h5>
                                                <p>{order_item.quantity - order_item.item_amount_returning}</p>
                                            </div>
                                            {order_item.all_items_returned ===
                                            true ? (
                                                <div className="order-details-div-child">
                                                    <button className="btn btn-warning">
                                                        All items have been
                                                        returned.
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="return-input order-details-div-child specific-order-details-div">
                                                        <input
                                                            className="return-qty-input"
                                                            type="number"
                                                            placeholder="Qty to Return"
                                                            value={
                                                                returningData.item_amount_returning
                                                            }
                                                            max={
                                                                order_item.quantity -
                                                                order_item.item_amount_returning
                                                            }
                                                            min={0}
                                                            onChange={(e) =>
                                                                handleAmountChange(
                                                                    order_item.id,
                                                                    Math.min(
                                                                        e.target
                                                                            .value,
                                                                        order_item.quantity -
                                                                            order_item.item_amount_returning
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}{" "}
                                {order.all_order_items_returned === false ? (
                                    <div className="return-btn-div">
                                        <button
                                            className="btn btn-primary return-order-btn"
                                            onClick={handleSubmit}
                                        >
                                            Submit Request
                                        </button>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    ) : (
                        <h5>No orders to return.</h5>
                    )}
                </>
            )}

            {submissionStatus === "success" && (
                <div>
                    <h3 className="pt-5">Items In Return Process</h3>
                    <div key={order.id} className="main-order-returning-data">
                        {itemReturnedData && (
                            <>
                                {itemReturnedData.map((item) => {
                                    // Find the corresponding item in returningData based on order_item_id
                                    const correspondingReturningItem = returningData.find((returningItem) => returningItem.order_item_id === item.id)

                                    console.log("correspondingReturningItem ", correspondingReturningItem)
                                    return (
                                        <>
                                            <div
                                                key={item.id}
                                                className="returning-item-process-details"
                                            >
                                                <img
                                                    src={
                                                        item.product_detail
                                                            .image
                                                    }
                                                    className="return-order-img order-returning-data-child "
                                                    alt={
                                                        item.product_detail.name
                                                    }
                                                />

                                                <div className="order-returning-data-child">
                                                    <h4>
                                                        {
                                                            item.product_detail
                                                                .name
                                                        }
                                                    </h4>
                                                </div>
                                                <div className="order-returning-data-child">
                                                    <h4>Order Item Number</h4>
                                                    <p className="order-returning-data-child">
                                                        {item.id}
                                                    </p>
                                                </div>
                                                <div className="order-returning-data-child">
                                                    <h4>Amount Returning</h4>
                                                    <p className="order-returning-data-child">
                                                        {/* Use the item_amount_returning from returningData */}
                                                        {
                                                            correspondingReturningItem?.item_amount_returning
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default PartialOrderReturn;
