import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Login } from "./Components/Login";
import axios from "axios";

import { TodoList } from "./Components/TodoList";
import { StrictMode, useEffect, useState } from "react";
import { checkToken } from "./Common/auth";

function App() {
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(checkToken());
    }, []);

    axios.defaults.baseURL = "http://localhost:5000";
    axios.defaults.headers.common["x-access-token"] = localStorage.getItem("token");
    return (
        <StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <TodoList /> : <Login />} />
                </Routes>
            </Router>
        </StrictMode>
    );
}

export default App;
