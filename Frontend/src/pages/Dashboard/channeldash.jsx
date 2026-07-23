// src/pages/Dashboard/ChannelDash.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChannelStats, getChannelVideos } from "../../services/dashboard.api.js";
import { deleteVideo } from "../../services/video.api.js";
import toast from "react-hot-toast";
function formatCount(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function ChannelDash() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getChannelStats(), getChannelVideos()])
      .then(([statsRes, videosRes]) => {
        setStats(statsRes.data?.data);
        setVideos(videosRes.data?.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch {
      toast.error("Failed to delete video");
    }
  };

  if (loading) return <DashSkeleton />;

  const statCards = [
    { label: "Total Videos", value: formatCount(stats?.totalVideos), icon: "🎬" },
    { label: "Total Views", value: formatCount(stats?.totalViews), icon: "👁️" },
    { label: "Subscribers", value: formatCount(stats?.totalSubscribers), icon: "👥" },
    { label: "Total Likes", value: formatCount(stats?.totalLikes), icon: "❤️" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Channel Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your content and track performance</p>
        </div>
        <button
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 rounded-full bg-[#ae7aff] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-5 flex flex-col gap-2"
          >
            <span className="text-2xl">{card.icon}</span>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-gray-400 text-xs">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Videos table */}
      <div className="rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-white font-semibold">Your Videos</h2>
          <span className="text-gray-400 text-sm">{videos.length} videos</span>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <span className="text-4xl">🎬</span>
            <p className="text-white font-semibold">No videos yet</p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-1 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
            >
              Upload your first video
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-[#2a2a2a]">
                  <th className="text-left px-5 py-3">Video</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Views</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video._id}
                    className="border-b border-[#2a2a2a] hover:bg-[#252525] transition"
                  >
                    {/* Thumbnail + title */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-24 rounded-lg overflow-hidden bg-[#2a2a2a] shrink-0">
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-600 text-xl">🎬</div>
                          )}
                        </div>
                        <p className="text-white font-medium line-clamp-2 max-w-xs">{video.title}</p>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">
                      {formatCount(video.views)}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                      {formatDate(video.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/video/${video._id}`)}
                          className="rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-xs text-white hover:bg-[#3a3a3a] transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DashSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-[#2a2a2a] rounded mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-[#2a2a2a]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-[#2a2a2a]" />
    </div>
  );
}