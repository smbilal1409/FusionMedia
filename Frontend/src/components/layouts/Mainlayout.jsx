
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