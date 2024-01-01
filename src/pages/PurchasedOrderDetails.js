import React from "react";
import { useLocation } from "react-router-dom";

const PurchasedOrderDetails = () => {
    const { state } = useLocation();
    const { data } = state;

    console.log("thank you data", data);
    return (
        <>
            <h2 className="thank-you-header">Thank you for the purchase</h2>
            <div className="purchased-item-detail-main-div">
                <div className="purchased-item-detail-inner-div">
                    <div className="shipping-detail-main-div">
                        <h3 className="shipping-detail-header">
                            Items will be shipped to
                        </h3>
                        <div className="shipping-detail-div">
                            <div className="shipping-detail-info shipping-detail-div-child">
                                <h5>
                                    {data.shipping_address.first_name}{" "}
                                    {data.shipping_address.last_name}
                                </h5>
                                <h5>{data.shipping_address.street_address}</h5>
                                {data.shipping_address.apt ? (
                                    <h5>Apt. {data.shipping_address.apt}</h5>
                                ) : (
                                    ""
                                )}

                                <h5>
                                    {data.shipping_address.city},{" "}
                                    {data.shipping_address.state}{" "}
                                    {data.shipping_address.zipcode}
                                </h5>
                            </div>
                            <div className=" shipping-time-info shipping-detail-div-child">
                                <h5>Estimated Delivery Time</h5>
                                <p>December, 25, 1996</p>
                            </div>
                        </div>
                    </div>
                    <div className="purchased-item-details-parent">
                        {data && (
                            <div className="purchased-item-details-div">
                                {data.order_items.map((item, index) => {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <div
                                                className="purchased-item-details-inner-div"
                                                key={item.id}
                                            >
                                                <img
                                                    className="submit-order-img purchased-item-details-child"
                                                    src={
                                                        item.product_detail
                                                            .image
                                                    }
                                                    alt={
                                                        item.product_detail
                                                            .image
                                                    }
                                                />
                                                <div className="purchased-item-details-child">
                                                    <p>
                                                        {
                                                            item.product_detail
                                                                .name
                                                        }
                                                    </p>
                                                </div>
                                                <div className="purchased-item-details-child">
                                                    <p>
                                                        {
                                                            item.product_detail
                                                                .description
                                                        }
                                                    </p>
                                                </div>
                                                <div className="purchased-item-details-child">
                                                    <p>
                                                        Amount purchased:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            {index <
                                                data.order_items.length - 1 && (
                                                <hr />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchasedOrderDetails;
