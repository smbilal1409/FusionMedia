
import React, { useState } from "react";
import { useAuth } from "../../Hooks/useauth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isUsingEmail, setIsUsingEmail] = useState(true);

  const submit = async (e) => {
    e.preventDefault();
    try {
      let credentials = isUsingEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await login(credentials);

      if (res.status >= 200 && res.status < 300) {
        const message =
          res.data?.message ||
          res.data?.data?.message ||
          "Login successful!";
        toast.success(message);
        navigate("/");
      } else {
        toast.error("Login failed with status " + res.status);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.statusText ||
        "Login failed";
      toast.error("Error: " + errorMessage);
    }
  };

  // Shared input styling, incl. a fix for Chrome/Edge autofill forcing a
  // white background + black text on saved credentials.
  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-[#1c1c1c] px-3.5 py-2.5 text-[15px] text-white " +
    "placeholder-gray-500 outline-none transition-colors focus:border-[#ae7aff] " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff] " +
    "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] " +
    "[&:-webkit-autofill]:shadow-[0_0_0px_1000px_#1c1c1c_inset]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-4 py-10 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171717] p-8 shadow-2xl shadow-black/40">
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <img
            src="/fusionmedia_logo.svg"
            alt="FusionMedia Logo"
            className="h-auto w-full max-w-[500px] object-fill"
          />
        </div>

        {/* Title */}
        <div className="mb-1 text-center text-2xl font-semibold">
          Welcome to FusionMedia
        </div>
        <p className="mb-6 text-center text-sm text-gray-500">
          Sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={submit} className="flex flex-col">
          {/* Segmented toggle */}
          <div className="mb-5 grid grid-cols-2 rounded-lg border border-gray-700 bg-[#1c1c1c] p-1 text-sm">
            <label
              className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors ${
                isUsingEmail ? "bg-[#ae7aff] text-black font-medium" : "text-gray-400"
              }`}
            >
              <input
                type="radio"
                checked={isUsingEmail}
                onChange={() => setIsUsingEmail(true)}
                className="hidden"
              />
              Email
            </label>
            <label
              className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors ${
                !isUsingEmail ? "bg-[#ae7aff] text-black font-medium" : "text-gray-400"
              }`}
            >
              <input
                type="radio"
                checked={!isUsingEmail}
                onChange={() => setIsUsingEmail(false)}
                className="hidden"
              />
              Username
            </label>
          </div>

          {/* Identifier */}
          <label htmlFor="identifier" className="mb-1.5 inline-block text-sm text-gray-300">
            {isUsingEmail ? "Email*" : "Username*"}
          </label>
          <input
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={isUsingEmail ? "Enter your email" : "Enter your username"}
            required
            className={`${inputClass} mb-4`}
          />

          {/* Password */}
          <label htmlFor="password" className="mb-1.5 inline-block text-sm text-gray-300">
            Password*
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className={`${inputClass} mb-6`}
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#ae7aff] px-4 py-3 font-semibold text-black transition hover:bg-[#9b63e5] active:scale-[0.99]"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-[#ae7aff] hover:underline">
              Sign up
            </a>
          </p>
          <p className="mt-2">
            <a href="/forgot-password" className="text-[#ae7aff] hover:underline">
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
