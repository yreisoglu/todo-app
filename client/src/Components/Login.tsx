import axios from "axios";
import { useState } from "react";
import { loginRequest, registerRequest } from "../Requests/user";

export const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (event: any) => {
        event.preventDefault();
        try {
            const response = await loginRequest(email, password);
            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem("token", token);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const register = async (event: any) => {
        event.preventDefault();
        try {
            const response = await registerRequest(email, password);
            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem("token", token);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold mb-8">Login</h1>
                <form className="w-80" onSubmit={login}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="flex w-full justify-center space-x-6">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="submit"
                        >
                            Login
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="button"
                            onClick={register}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
