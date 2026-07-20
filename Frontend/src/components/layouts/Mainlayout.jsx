// src/components/Layout/MainLayout.jsx
// This is the SHELL that wraps every page after login.
// Usage: wrap any page with <MainLayout> in App.jsx
// It handles the Navbar at top, Sidebar on left, and the page content on right.
import { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Top navbar — fixed, full width */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar — fixed on left, slides in on mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — pushed right on desktop to make room for sidebar */}
      <main className="pt-16 lg:pl-60 min-h-screen">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}