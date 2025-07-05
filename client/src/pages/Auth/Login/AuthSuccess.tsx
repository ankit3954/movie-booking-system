import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { storeToken } from "../../../utils/helpers/storage";

const AuthSuccess = () => {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    const {handleToken} = useAuth()

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/register");
            return;
        }

        // localStorage.setItem("authToken", token);
        storeToken(token)
        handleToken(token)
        navigate("/");
    }, [navigate]);

    return <p>Logging in...</p>;
};

export default AuthSuccess;
