import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";

import {config} from "../Constants"

const url = config.url.API_URL;

const ProductPage = () => {
    //const [backendInfo, setBackendInfo] = useState(null);
    const [items, setItems] = useState([]);

    const token = localStorage.getItem("access");

    //home url, http://127.0.0.1:8000/home
    
    useEffect(() => {
        getProducts();
        if (!token) {
            getData();
        }
    }, [token]);
    
    const getData = async () => {
        try {
            const response = await fetch(`${url}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                console.log("data", data);
                //setBackendInfo(data.message);
            } else {
                throw new Error("Request Failed");
            }
        } catch (error) {
            console.log("Error", error);
        }
    };
    

    const getProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${url}/products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: "include",
            });

            console.log("response", response);

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            console.log("data", data);
            setItems(data);
        } catch (error) {
            console.log("Error", error);
        }
    };

    return (
        <div className="home-page-div">
            <section className="all-product-div">
                {items.map((item) => (
                    <div key={item.id} className="single-product-div">
                        <img
                            src={item.image}
                            className="home-page-product-img"
                            alt={item.name}
                        />
                        <h1>{item.name}</h1>
                        <p>{item.price}</p>
                        {item.quantity === 0 ? (
                            <badge className="bg bg-danger not-available-badge">
                                Not Available.
                            </badge>
                        ) : (
                            <>
                                <Link
                                    to={`/detail/${item.id}`}
                                    className="btn btn-primary"
                                >
                                    Details
                                </Link>
                            </>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ProductPage;
