// src/services/api.js
import axios from "axios";

// This is the ONE axios instance your entire app uses.
// Every API call goes through here — no need to type the base URL again anywhere.
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // 👈 Change this to your backend URL
  withCredentials: true,                   // sends cookies (refresh token) automatically
});

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────────
// Before every request, grab the accessToken from localStorage and attach it.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
// If the server returns 401 (token expired), automatically try to refresh it.
// If refresh also fails, log the user out.
api.interceptors.response.use(
  (response) => response, // success → just return it
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop

      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/refresh_token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.data?.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry the failed request with new token
      } catch (refreshError) {
        // Refresh failed → clear storage and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
