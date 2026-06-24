import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login_with_google() {
  const navigate = useNavigate();

  return (
    <>
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-stone-300"></div>
        <span className="px-3 text-sm text-slate-500">
          OR
        </span>
        <div className="h-px flex-1 bg-stone-300"></div>
      </div>

      <div className="flex justify-center rounded-2xl border border-stone-200 bg-stone-50 p-4">

        <GoogleLogin
          theme="outline"
          size="large"
          text="continue_with"
          shape="pill"
          width="300"
          onSuccess={async (credentialResponse) => {

            const decoded = jwtDecode(
              credentialResponse.credential
            );

            try {

              const res = await fetch(
                `${API_BASE_URL}/googlelogin`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    name: decoded.name,
                    email: decoded.email
                  })
                }
              );

              const data = await res.json();

              console.log(data);
              localStorage.setItem("isLoggedIn", "true");

              navigate("/home");

            } catch (error) {
              console.log(error);
            }

          }}
          onError={() => {
            console.log("login failed");
          }}
        />
      </div>
    </>
  );
}

export default Login_with_google;