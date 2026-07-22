// // src/main.jsx
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import { AuthProvider } from "./context/authcontext.jsx"; // ✅ make sure path is correct
// // import "./index.css"; // keep if exists
// import "tailwindcss/tailwind.css";
// import './styles/global.css'
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
// src/main.jsx  (or index.js depending on your setup)
// This is the entry point. Just make sure App is imported here.


// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./routers/App.jsx";
// import "./index.css"; // your Tailwind CSS file

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
import ReactDOM from "react-dom/client";
import App from "./routers/App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
