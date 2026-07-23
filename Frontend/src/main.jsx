

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
import { Toaster } from "react-hot-toast";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster position="top-right" />
  </>
);
