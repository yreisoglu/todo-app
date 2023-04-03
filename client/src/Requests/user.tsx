import axios from "axios";

export const loginRequest = async (email: string, password: string) => {
    return await axios.post("/user/login", { email, password });
};
export const registerRequest = async (email: string, password: string) => {
    return await axios.post("/user/register", { email, password });
};