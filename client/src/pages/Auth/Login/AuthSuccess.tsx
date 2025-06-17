import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/register");
            return;
        }

        localStorage.setItem("authToken", token);
        navigate("/");
    }, [navigate]);

    return <p>Logging in...</p>;
};

export default AuthSuccess;
