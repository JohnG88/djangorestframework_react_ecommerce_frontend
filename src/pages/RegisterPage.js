import React from "react";

import { useState } from "react";

import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { register } from "../features/auth/userSlice";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const { registered, loading } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // destructuring data
    const { username, email, password } = formData;

    // using spread operator will change one value instead of changing all or other values
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        console.log("Handle Submit Clicked")
        e.preventDefault();

        dispatch(register({ username, email, password }));
    };

    if (registered) {
        return <Navigate to="/login" />;
    }

    return (
        <React.Fragment>
        <div className="register-form-main-div">
            <h2>Register for an Account</h2>
            <div className="register-form-div">
            <form className="mt-5 register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="username">
                        First Name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={username}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                </div>
                <div className="form-group register-password-div mt-3">
                    <label className="form-label" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="form-control"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <button className="btn btn-primary mt-4">Register</button>
                )}
            </form>
            </div>
        </div>
        </React.Fragment>
    );
};

export default RegisterPage;
