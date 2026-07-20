
import { useNavigate } from "react-router-dom";

function formatViews(num) {
  if (!num) return "0 views";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M views";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K views";
  return num + " views";
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hrs > 0) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  return `${mins} min ago`;
}

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  if (!video) return null;

  // ✅ Exact field names from your backend
  const thumbnail = video?.Thumnil || video?.thumbnail || null;
  const owner     = typeof video?.owner === "object" ? video.owner : null;

  return (
    <div
      onClick={() => navigate(`/video/${video._id}`)}
      className="group cursor-pointer flex flex-col gap-2"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1e1e1e]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1e1e1e]">
            <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
            {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3">
        <div
          className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (owner?.username) navigate(`/profile/${owner.username}`);
          }}
        >
          {owner?.avatar ? (
            <img src={owner.avatar} alt={owner.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#ae7aff]">
              {owner?.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
            {video.title}
          </p>
          <p
            className="text-gray-400 text-xs mt-1 hover:text-white cursor-pointer transition"
            onClick={(e) => {
              e.stopPropagation();
              if (owner?.username) navigate(`/profile/${owner.username}`);
            }}
          >
            {owner?.fullName || owner?.username || "Unknown"}
          </p>
          <p className="text-gray-500 text-xs">
            {formatViews(video.views)} · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}