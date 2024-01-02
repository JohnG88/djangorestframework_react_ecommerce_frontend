import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {config} from "../Constants"

const url = config.url.API_URL;

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getRegister();
    }, []);

    const getRegister = async () => {
        const response = await fetch(`${url}/register`, {
            method: "GET",
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = fetch(`${url}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                }),
                credentials: "include",
            });
            const data = response.json();
            console.log("Register data", data);

            //const token = data.access;
            //localStorage.setItem("token", token);
            navigate("/login");
        } catch (error) {
            console.log("Login failed:", error);
        }
    };

    return (
        <section>
            <div className="register-form-main-div">
                <div className="register-form-div">
                    <form className="register-form" onSubmit={handleRegister}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterForm;
