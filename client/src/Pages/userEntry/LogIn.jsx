import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User_exist } from "../check/User_exist";

import Login_with_google from "./login_with_google";



const LogIn = () => {
  User_exist();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!email.includes("@")) {
      return setError("Please enter a valid email");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        localStorage.setItem("isLoggedIn", "true");

        navigate("/home");

      } else {

        setError(data.message || "Login failed");

      }

    } catch (err) {

      console.error(err);
      setError("Could not connect to server");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 py-10 flex items-center justify-center overflow-hidden">

      {/* Login Card */}
      <div className="w-full max-w-md rounded-[32px] border border-stone-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">

        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">

          <span className="text-3xl">🛒</span>

          <h1 className="text-2xl font-bold tracking-wide text-slate-800">
            eCommerce
          </h1>

        </div>

        {/* Heading */}
        <div className="mb-8 text-center">

          <h2 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Login to continue shopping
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
            />

          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 pr-16 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition-all duration-300 hover:text-amber-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">

            <button
              type="button"
              onClick={() => navigate("/forgotpass")}
              className="text-sm font-medium text-slate-500 transition-all duration-300 hover:text-amber-700"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-800 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Signup */}
        <div className="mt-8 text-center text-sm text-slate-500">

          Don&apos;t have an account?{" "}

          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-amber-700 transition-all duration-300 hover:text-amber-800 hover:underline"
          >
            Sign Up
          </button>

        </div>


{/* Google Login */}

  <Login_with_google />

      </div>
    </div>
  );
};

export default LogIn;