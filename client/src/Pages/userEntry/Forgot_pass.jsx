import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { User_exist } from "../check/User_exist";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Forgot_pass = () => {
  User_exist();

  const navigate = useNavigate();

  const realOTPRef = useRef(null);

  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [newpass, setnewpass] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // Send OTP
  const sendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      const otp = data.otp;

      realOTPRef.current = otp;

      const templateParams = {
        email,
        otp,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_1u8segw",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_ok2yj4m",
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YajAGrBQL4Re_OGTm"
      );

      setSuccess("OTP sent successfully!");
      setShowOTPForm(true);

    } catch (err) {
      console.log(err);
      setError("Failed to send OTP");

    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const isvalid = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const enteredotp = Number(e.target.otp.value);

    if (enteredotp === realOTPRef.current) {

      setShowNewPassword(true);
      setShowOTPForm(false);

      setSuccess("OTP verified successfully!");

    } else {

      setError("Wrong OTP. Please try again.");

      e.target.otp.value = "";

    }
  };

  // Change Password
  const changepass = async () => {

    setError("");
    setSuccess("");

    if (!newpass || newpass.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/forgotpass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newpass,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        setSuccess("Password changed successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {
        setError(data.message || "Failed to change password");
      }

    } catch (err) {

      console.log(err);
      setError("Server error. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 py-10 flex items-center justify-center">

      {/* Card */}
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
            Forgot Password
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Reset your password securely
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
            {success}
          </div>
        )}

        {/* Step 1 */}
        {!showOTPForm && !showNewPassword && (

          <form onSubmit={sendOTP} className="space-y-5">

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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-800 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>
        )}

        {/* Step 2 */}
        {showOTPForm && (

          <form onSubmit={isvalid} className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Enter OTP
              </label>

              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                required
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
              />

            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-800 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400"
            >
              Verify OTP
            </button>

          </form>
        )}

        {/* Step 3 */}
        {showNewPassword && (

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newpass}
                onChange={(e) => setnewpass(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
              />

            </div>

            <button
              onClick={changepass}
              disabled={loading}
              className="w-full rounded-2xl bg-slate-800 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>

          </div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">

          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-slate-500 transition-all duration-300 hover:text-amber-700"
          >
            ← Back to Login
          </button>

        </div>

      </div>
    </div>
  );
};

export default Forgot_pass;