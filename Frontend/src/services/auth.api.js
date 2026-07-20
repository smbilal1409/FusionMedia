// src/services/authService.js
// Handles all /users routes
import api from "./api";

export const registerUser = (formData) =>
  api.post("/user/register", formData); 

export const loginUser = (credentials) =>
  api.post("/user/login", credentials);

export const logoutUser = () =>
  api.post("/user/logout");

export const getCurrentUser = () =>
  api.get("/user/currentuser");

export const changePassword = (data) =>
  api.post("/user/changepassword", data);

export const updateAccountDetails = (data) =>
  api.put("/user/updateaccountdetails", data);

export const updateAvatar = (formData) =>
  api.patch("/user/update-avatar", formData);

export const updateCoverImage = (formData) =>
  api.patch("/user/update-cover-image", formData);

export const getChannelProfile = (username) =>
  api.get(`/user/getthechannelprofile/${username}`);

export const getWatchHistory = () =>
  api.get("/user/getthewatchhistory");

export const authAPI = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  changePassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getChannelProfile,
  getWatchHistory,
};