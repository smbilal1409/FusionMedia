// src/components/Layout/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useauth";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
const handleSearch = (e) => {
  e.preventDefault();
  if (search.trim()) {
    navigate(`/search?search=${search.trim()}`);  // ← must be /search
  }
};
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between gap-4 bg-[#121212] border-b border-[#2a2a2a] px-4">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Hamburger — only visible on mobile */}
        <button
          className="text-white lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <img
          src="/fusionmediaicon.svg"
          alt="FusionMedia"
          className="h-8 w-auto cursor-pointer object-contain"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Center: Search bar */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-lg items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos, tweets, people..."
          className="w-full rounded-l-full border border-[#333] bg-[#1e1e1e] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-r-full border border-l-0 border-[#333] bg-[#2a2a2a] px-4 py-2 text-gray-400 hover:text-[#ae7aff] transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </form>

      {/* Right: Upload + Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Upload button */}
        <button
          onClick={() => navigate("/upload")}
          className="hidden sm:flex items-center gap-2 rounded-full bg-[#ae7aff] px-4 py-1.5 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload
        </button>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-9 w-9 rounded-full overflow-hidden border-2 border-[#ae7aff] focus:outline-none"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#ae7aff] text-black font-bold text-sm">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-[#2a2a2a]">
                <p className="text-white text-sm font-semibold">{user?.fullName}</p>
                <p className="text-gray-400 text-xs">@{user?.username}</p>
              </div>
              {[
                { label: "Your Channel", path: `/profile/${user?.username}` },
                { label: "Dashboard", path: "/dashboard" },
                { label: "Liked Videos", path: "/liked" },
                { label: "Watch History", path: "/history" },
                { label: "Settings", path: "/settings" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-[#2a2a2a] mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}