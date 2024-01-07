import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { login, getUser } from "../features/auth/userSlice";

const LoginForm = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((store) => store.user);

    //const [username, setUsername] = useState("");
    //const [password, setPassword] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    // destructuring data
    const { username, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //dispatch(login({ username, password }));
        await dispatch(login({ username, password }));

        dispatch(getUser())
    };

    if (isAuthenticated) {
        return <Navigate to="/order-container" />;
    }

    //const navigate = useNavigate();

    /*
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            const data = await response.json();
            console.log("Login data", data);

            const token = data.access;
            localStorage.setItem("token", token);
            navigate("/order-container");
        } catch (error) {
            console.log("Login failed:", error);
        }
    };
    */

    return (
        
        <section>
            <div className="login-form-main-div">
                <h2>Login to your Account</h2>
                <div className="login-form-div">
                    <form className="mt-5 login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                className="form-control"
                                type="username"
                                name="username"
                                onChange={handleChange}
                                value={username}
                                required
                            />
                        </div>
                        <div className="form-group login-password-div mt-3">
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
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <button className="btn btn-primary mt-4">
                                Login
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
