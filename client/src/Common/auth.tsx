import jwt from "jwt-decode";

export const checkToken = () => {
    const token = localStorage.getItem("token") as string;

    try {
        const decodedToken = jwt(token) as any;

        const isTokenExpired = decodedToken.exp > Date.now() / 1000;

        return isTokenExpired;
    } catch (err) {
        console.error(err);
        return false
    }
};
