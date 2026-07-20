// src/components/TweetCard/TweetCard.jsx
// Reusable tweet card used in Home feed and Tweets page.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleTweetLike } from "../../services/like.api.js";
import { useAuth } from "../../Hooks/useauth.js";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

export default function TweetCard({ tweet, onDelete, onEdit }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState(tweet?.isLiked || false);
  const [likeCount, setLikeCount] = useState(tweet?.likesCount || 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLike = async () => {
    try {
      await toggleTweetLike(tweet._id);
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const isOwner = user?.username === tweet?.owner?.username;

  return (
    <div className="border-b border-[#2a2a2a] px-4 py-4 hover:bg-[#1a1a1a] transition">
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a] cursor-pointer"
          onClick={() => navigate(`/profile/${tweet?.owner?.username}`)}
        >
          {tweet?.owner?.avatar ? (
            <img src={tweet.owner.avatar} alt={tweet.owner.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#ae7aff]">
              {tweet?.owner?.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-white text-sm font-semibold cursor-pointer hover:underline truncate"
                onClick={() => navigate(`/profile/${tweet?.owner?.username}`)}
              >
                {tweet?.owner?.fullName || tweet?.owner?.username}
              </span>
              <span className="text-gray-500 text-xs shrink-0">
                @{tweet?.owner?.username} · {timeAgo(tweet?.createdAt)}
              </span>
            </div>

            {/* 3-dot menu for owner */}
            {isOwner && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-500 hover:text-white transition p-1 rounded-full hover:bg-[#2a2a2a]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-32 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] shadow-xl z-10 py-1">
                    <button
                      onClick={() => { onEdit?.(tweet); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { onDelete?.(tweet._id); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tweet text */}
          <p className="text-gray-200 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
            {tweet?.content}
          </p>

          {/* Actions row */}
          <div className="flex items-center gap-6 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition ${liked ? "text-[#ae7aff]" : "text-gray-500 hover:text-[#ae7aff]"}`}
            >
              <svg className="h-4 w-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}