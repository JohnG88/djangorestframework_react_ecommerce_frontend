import { config } from "../Constants";

const url = config.url.API_URL;
// tokenManager.js

// Function to check if the access token is expired
export const isTokenExpired = (token) => {
    if (!token) return true;

    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expiration = tokenData.exp * 1000; // Convert expiration time to milliseconds

    return expiration < Date.now();
};

// Function to refresh the access token
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await fetch(`${url}/refresh`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        });

        const data = await response.json();
        console.log("refresh data", data)
        if (response.status === 200) {
            // Refresh successful, return the new access token
            return data.access;
        } else {
            throw new Error("Refresh failed");
        }
    } catch (error) {
        throw new Error("Refresh failed");
    }
};
