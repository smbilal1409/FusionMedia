
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.api.js";
import toast from "react-hot-toast";
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCover = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Avatar is required
    if (!avatar) {
      toast.error("Please upload a profile picture to continue.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("avatar", avatar);
      if (coverImage) formData.append("coverimage", coverImage);

      await registerUser(formData);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      toast.error("Error: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // Shared input styling, incl. a fix for Chrome/Edge autofill forcing a
  // white background + black text on saved values.
  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-[#1c1c1c] px-3 py-2 text-sm text-white " +
    "placeholder-gray-500 outline-none transition-colors focus:border-[#ae7aff] " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff] " +
    "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] " +
    "[&:-webkit-autofill]:shadow-[0_0_0px_1000px_#1c1c1c_inset]";

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-[#121212] px-4 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#171717] p-10 shadow-2xl shadow-black/40">
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <img
            src="/fusionmedia_logo.svg"
            alt="FusionMedia Logo"
            className="h-auto w-full max-w-[400px] object-fill"
          />
        </div>

        {/* Title */}
        <h2 className="mb-0.5 text-center text-lg font-semibold">
          Create your account
        </h2>
        <p className="mb-4 text-center text-xs text-gray-500">
          Join FusionMedia today
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {/* Full Name + Username */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="mb-1 text-xs text-gray-300">Full Name*</label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Full name"
                required
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs text-gray-300">Username*</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Email + Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="mb-1 text-xs text-gray-300">Email*</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs text-gray-300">Password*</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Avatar (required) + Cover (optional) */}
          <div className="mt-1 flex items-center gap-4">
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div
                className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-full border border-[#ae7aff]/60 bg-[#1c1c1c] group"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[9px] leading-tight text-gray-500 transition group-hover:text-[#ae7aff] text-center px-1">
                    Add photo
                  </div>
                )}
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  required
                  className="hidden"
                  onChange={handleAvatar}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300">Profile picture*</span>
                <button
                  type="button"
                  onClick={() => document.getElementById("avatarInput").click()}
                  className="mt-0.5 w-fit text-[11px] text-[#ae7aff] hover:underline"
                >
                  {avatarPreview ? "Change" : "Upload"}
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div
              className="relative flex h-14 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-700 bg-[#1c1c1c] group"
              onClick={() => document.getElementById("coverInput").click()}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="h-full w-full object-cover opacity-90"
                />
              ) : (
                <span className="px-2 text-center text-[10px] text-gray-500 transition group-hover:text-[#ae7aff]">
                  + Cover (optional)
                </span>
              )}
              <input
                id="coverInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCover}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-[#ae7aff] px-4 py-2.5 font-semibold text-black transition hover:bg-[#9b63e5] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#ae7aff] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}