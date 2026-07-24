
// import axios from "axios";


// // const api = axios.create({
// //   baseURL: "http://localhost:8000/api/v1", 
// //   withCredentials: true,                   
// // });

// const api = axios.create({
//   baseURL: "https://fusionmedia-production.up.railway.app/api/v1", 
//    withCredentials: true,                   
//  });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// api.interceptors.response.use(
//   (response) => response, 
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; 

//       try {
//         const res = await axios.post(
//           "http://localhost:8000/api/v1/user/refresh_token",
//           {},
//           { withCredentials: true }
//         );

//         const newToken = res.data?.data?.accessToken;
//         localStorage.setItem("accessToken", newToken);
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         return api(originalRequest); 
//       } catch (refreshError) {
       
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("user");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

const BASE_URL = "https://fusionmedia-production.up.railway.app/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/user/refresh_token`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.data?.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
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