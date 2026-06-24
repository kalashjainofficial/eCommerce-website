import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User_exist } from "../check/User_exist";
// login with google
import Login_with_google from "./login_with_google";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  User_exist();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (name.trim().length < 3) {
      return setError("Name must be at least 3 characters");
    }

    if (!email.includes("@")) {
      return setError("Please enter a valid email");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        localStorage.setItem("isLoggedIn", "true");

        setName("");
        setEmail("");
        setPassword("");

        navigate("/home");

      } else {

        setError(data.message || "Signup failed");

      }

    } catch (err) {

      console.error(err);
      setError("Could not connect to server");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 flex items-center justify-center overflow-hidden">

  <div className="w-full max-w-md rounded-[28px] border border-stone-200 bg-white/90 p-6 shadow-2xl backdrop-blur-sm">

    {/* Logo */}
    <div className="mb-4 flex items-center justify-center gap-2">
      <span className="text-2xl">🛒</span>

      <h1 className="text-xl font-bold tracking-wide text-slate-800">
        eCommerce
      </h1>
    </div>

    {/* Heading */}
    <div className="mb-5 text-center">

      <h2 className="text-2xl font-bold text-slate-800">
        Create Account
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Sign up to start shopping
      </p>

    </div>

    {/* Error */}
    {error && (
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Name */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Full Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Password
        </label>

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 pr-16 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-amber-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>
      </div>

      {/* Signup Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-800 px-4 py-2.5 font-semibold text-white transition-all hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>

    </form>

    {/* Login Link */}
    <div className="mt-4 text-center text-sm text-slate-500">

      Already have an account?{" "}

      <button
        onClick={() => navigate("/login")}
        className="font-semibold text-amber-700 hover:underline"
      >
        Login
      </button>

    </div>

    

    {/* Google Login */}
    <div>
      <Login_with_google />
    </div>

    

  </div>
</div>
  );
};

export default SignUp;