import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const User_exist = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const checkAuth = async () => {

            try {

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/home`, {
                    credentials: "include"
                });

                if (response.ok) {
                    navigate("/home");
                }

            } catch (error) {

                console.log(error);

            }

        };

        checkAuth();

    }, []);

};