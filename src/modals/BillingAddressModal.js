import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
//import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const BillingAddressForm = ({
    username,
    show,
    handleClose,
    billingAddress,
    updateShippingBillingAddress,
}) => {
    const inputRef = useRef(null);

    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        streetAddress: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
    });

    const {
        firstName,
        lastName,
        //email,
        streetAddress,
        apt,
        city,
        state,
        zipcode,
    } = formData;

    const [formEditable, setFormEditable] = useState(false);
    const [toggleEditSaveButton, setToggleEditSaveButton] = useState(true);

    useEffect(() => {
        if (billingAddress) {
            setFormData({
                id: billingAddress.id,
                firstName: billingAddress.first_name,
                lastName: billingAddress.last_name,
                streetAddress: billingAddress.street_address,
                apt: billingAddress.apt,
                city: billingAddress.city,
                state: billingAddress.state,
                zipcode: billingAddress.zipcode,
            });
        } else {
            setFormEditable(true);
            if (show) {
                setTimeout(() => {
                    inputRef.current.focus();
                }, 500);
            }
        }
    }, [billingAddress, show, username]);

    const handleEditClick = () => {
        setFormEditable(true);
        setToggleEditSaveButton(true);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleEditSaveButtonToggle = () => {
        if (toggleEditSaveButton === true) {
            setToggleEditSaveButton(false);
        } else {
            setToggleEditSaveButton(true);
            setFormEditable(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const access = localStorage.getItem("access");

        const response = await fetch(
            "http://127.0.0.1:8000/update-billing-address",
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
                    address_type: "billing",
                    first_name: firstName,
                    last_name: lastName,
                    street_address: streetAddress,
                    apt: apt,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                    onanimationstart,
                }),
            }
        );

        const data = await response.json();
        console.log("billing address data", data);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Billing Address Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="firstName"
                                >
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
                                <label
                                    className="form-label"
                                    htmlFor="lastName"
                                >
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
                            {username &&
                            billingAddress &&
                            billingAddress.address_type !== null ? (
                                <>
                                    {toggleEditSaveButton && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                handleEditClick();
                                                handleEditSaveButtonToggle();
                                            }}
                                        >
                                            Edit Billing Address
                                        </Button>
                                    )}
                                    {!toggleEditSaveButton && (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    updateShippingBillingAddress(
                                                        formData,
                                                        "billing"
                                                    );
                                                    handleEditSaveButtonToggle();
                                                }}
                                            >
                                                Update Billing Address
                                            </Button>
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
                            ) : (
                                <div className="mb-3">
                                    <button
                                        className="submit-order-btn"
                                        onClick={(e) => {
                                            handleSubmit(e);
                                            handleClose();
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>{/* Your Modal Footer */}</Modal.Footer>
            </Modal>
        </div>
    );
};

/*
const BillingAddressForm = ({
    username,
    show,
    handleClose,
    billingAddress,
    updateShippingBillingAddress,
}) => {
    const inputRef = useRef(null);

    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        //email: "",
        streetAddress: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
    });

    const [formEditable, setFormEditable] = useState(false);
    const [toggleSaveButton, setToggleSaveButton] = useState(true);
    //const [toggleEditButton, setToggleEditButton] = useState(true)
    const [toggleEditSaveButton, setToggleEditSaveButton] = useState(true);

    //console.log("username in billing modal ", username);

    useEffect(() => {
        console.log("billing info  renders in useEffect.");
        if (billingAddress) {
            setFormData({
                id: billingAddress.id,
                firstName: billingAddress.first_name,
                lastName: billingAddress.last_name,
                streetAddress: billingAddress.street_address,
                apt: billingAddress.apt,
                city: billingAddress.city,
                state: billingAddress.state,
                zipcode: billingAddress.zipcode,
            });
        } else {
            setFormEditable(true);
            if (show) {
                setTimeout(() => {
                    inputRef.current.focus();
                }, 500);
            }
        }
    }, [billingAddress, show]);

    //console.log("username ", username);
    //console.log("formEditable ", formEditable);
    //console.log("input current ", inputRef.current);
    /*
    useEffect(() => {
        console.log("input ref current in useEffect ", inputRef.current);
        if (formEditable && show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);
    */
/*
    if (username === null && formEditable) {
        //setTimeout(() => {
        //    inputRef.current.focus();
        //}, 0)
        
        inputRef.current.focus();
        console.log("useEffect for focusing on input executed");
    }
    */

/*
    useLayoutEffect(() => {
        if (username === null && formEditable) {
            if (inputRef.current) {
                setTimeout(() => {
                    inputRef.current.focus();
                }, 0)
                
            }
        }
    }, [username, formEditable])
    */

//if (billingAddress === undefined) {
//    setToggleSaveButton(false);
//}

//const handleEditClick = () => {
//    setFormEditable(true);

//    setTimeout(() => {
//        if (inputRef.current) {
//            inputRef.current.focus();
//        }
//    }, 0);
//};

/*
    const [formData, setFormData] = useState({
        id: billingAddress?.id || '',
        firstName: billingAddress?.first_name || '',
        lastName: billingAddress?.last_name || '',
        //email: "",
        streetAddress: billingAddress?.street_address || '',
        apt: billingAddress?.apt || '',
        city: billingAddress?.city || '',
        state: billingAddress?.state || '',
        zipcode: billingAddress?.zipcode || '',
    });
    */

//console.log("form data billing ", formData)

/*
    if (billingAddress != null) {
        setFormData({
            firstName: billingAddress.first_name,
            lastName: billingAddress.last_name,
            streetAddress: billingAddress.street_address,
            apt: billingAddress.apt,
            city: billingAddress.city,
            state: billingAddress.state,
            zipcode: billingAddress.zipcode,
        });
    }
    */
/*
    const {
        id,
        firstName,
        lastName,
        //email,
        streetAddress,
        apt,
        city,
        state,
        zipcode,
    } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditSaveButtonToggle = () => {
        if (toggleEditSaveButton === true) {
            setToggleEditSaveButton(false);
        } else {
            setToggleEditSaveButton(true);
            setFormEditable(false);
        }
    };

    /*
    const handleChange = (e) => {
        billingAddress[e.target.name] = e.target.value
    }
    */
/*
    const handleSubmit = async (e) => {
        e.preventDefault();

        const access = localStorage.getItem("access");

        const response = await fetch(
            "http://127.0.0.1:8000/update-billing-address",
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
                    address_type: "billing",
                    first_name: firstName,
                    last_name: lastName,
                    street_address: streetAddress,
                    apt: apt,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                }),
            }
        );

        const data = await response.json();
        console.log("billing address data", data);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Billing Address Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Your billing address form goes here 
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="firstName"
                                >
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
                                <label
                                    className="form-label"
                                    htmlFor="lastName"
                                >
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
                            {/*
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

                            {username != null ? (
                                <>
                                    {toggleEditSaveButton && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                handleEditClick();
                                                handleEditSaveButtonToggle();
                                            }}
                                        >
                                            Edit Billing Address
                                        </Button>
                                    )}
                                    {!toggleEditSaveButton && (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    updateShippingBillingAddress(
                                                        formData,
                                                        "billing"
                                                    );
                                                    handleEditSaveButtonToggle();
                                                }}
                                            >
                                                Update Billing Address
                                            </Button>
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
                            ) : (
                                <div className="mb-3">
                                    <button
                                        className="submit-order-btn"
                                        onClick={(e) => {
                                            handleSubmit(e);
                                            handleClose();
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/*
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
//};
//*/

export default BillingAddressForm;
