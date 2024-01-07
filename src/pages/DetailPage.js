import React, { useEffect, useState, useCallback } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { config } from "../Constants";

const url = config.url.API_URL;

const DetailPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.detailId;

    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(0);
    const [itemQuantityNumber, setItemQuantityNumber] = useState(null);
    const [error, setError] = useState("");

    const isButtonDisabled = number < 1;

    const getProduct = useCallback(async () => {
        try {
            const response = await fetch(
                `${url}/product/${itemId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("API request failed.");
            }

            const data = await response.json();
            console.log("Detail item page ", data);
            setItem(data);
            setItemQuantityNumber(data.quantity);
        } catch (error) {
            console.log("Error", error);
        }
    }, [itemId])    

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const quantity = parseInt(number, 10);
            if (isNaN(quantity) || quantity > itemQuantityNumber) {
                setError(`Item quantity cannot exceed ${itemQuantityNumber}`);
                return;
            }

            const access = localStorage.getItem("access");
            const response = await fetch(
                `${url}/product/${itemId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        //'X-CSRFToken': csrftoken,
                        ...(access && {
                            Authorization: `Bearer ${access}`,
                        }),
                    },
                    body: JSON.stringify({ quantity: number }),
                    // use credentials: include to send cookies with post request
                    credentials: "include",
                }
            );
            // Wait for the fetch request to complete before navigating
            if (response.ok) {
                navigate("/order-container");
            } else {
                console.log("Error", response.statusText);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    return (
        <section>
            <div className="detail-page-product-div">
                <div>
                    <img
                        src={item.image}
                        className="detail-page-img"
                        alt={item.name}
                    />
                </div>
                <div className="details-form-div">
                    <h2>{item.name}</h2>
                    <p>${item.price}</p>
                    <p>{item.description}</p>
                    {item.quantity === 0 ? (
                        <badge className="bg bg-danger not-available-badge">Not Available.</badge>
                    ) : (
                        <>
                            <form
                                onSubmit={handleSubmit}
                                className="detail-page-qty-form"
                            >
                                {error && (
                                    <div
                                        style={{
                                            color: "red",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) =>
                                            setNumber(e.target.value)
                                        }
                                        min={0}
                                        max={item.quantity}
                                    />
                                </div>
                                <div className="detail-qty-btn-div">
                                    <button
                                        className="detail-page-qty-btn btn btn-warning"
                                        type="submit"
                                        disabled={isButtonDisabled}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DetailPage;
