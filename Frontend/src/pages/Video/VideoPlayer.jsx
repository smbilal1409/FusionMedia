
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useauth";
import { getVideoById } from "../../services/video.api.js";
import { toggleVideoLike } from "../../services/like.api.js";
import { toggleSubscription } from "../../services/subscription.api.js";
import CommentSection from "../../components/commentsection/commentslist.jsx";
import AddToPlaylistModal from "../../components/Playlist/AddToPlaylistModal.jsx";
import toast from "react-hot-toast";
function formatViews(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
}
 
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}
 
export default function VideoPlayer() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
 
  const [video, setVideo]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [liked, setLiked]             = useState(false);
  const [likeCount, setLikeCount]     = useState(0);
  const [subscribed, setSubscribed]   = useState(false);
  const [subCount, setSubCount]       = useState(0);
  const [descExpanded, setDescExpanded]       = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false); // ✅ Save modal
 
  useEffect(() => {
    setLoading(true);
    getVideoById(videoId)
      .then((res) => {
        const v = res.data?.data;
        setVideo(v);
        setLiked(v?.isLiked || false);
        setLikeCount(v?.likesCount || 0);
        setSubscribed(v?.owner?.isSubscribed || false);
        setSubCount(v?.owner?.subscribersCount || 0);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [videoId]);
 
  const handleLike = async () => {
    try {
      await toggleVideoLike(videoId);
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    } catch {
      toast.error("Failed to toggle like");
    }
  };
 
  const handleSubscribe = async () => {
    const ownerId =
      typeof video?.owner === "object"
        ? video.owner._id
        : video?.owner;
    if (!ownerId) return toast.error("Cannot subscribe — owner info missing");
    try {
      await toggleSubscription(ownerId);
      setSubscribed(!subscribed);
      setSubCount((c) => (subscribed ? c - 1 : c + 1));
    } catch {
      toast.error("Failed to toggle subscription");
    }
  };
 
  if (loading) return <VideoPlayerSkeleton />;
  if (!video) return null;
 
  const videoUrl  = video?.videofile || video?.videoFile || null;
  const thumbnail = video?.Thumnil   || video?.thumbnail || null;
  const owner     = typeof video?.owner === "object" ? video.owner : null;
 
  const isOwner =
    (user?._id && owner?._id && String(user._id) === String(owner._id)) ||
    (user?.username && owner?.username && user.username === owner.username);
 
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
 
          {/* Video player */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
            {videoUrl ? (
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                autoPlay
                poster={thumbnail || undefined}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-500">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-center px-4">Video unavailable.</p>
              </div>
            )}
          </div>
 
          {/* Title + views */}
          <h1 className="text-white font-bold text-xl mt-4 leading-snug">{video.title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {formatViews(video.views)} views · {formatDate(video.createdAt)}
          </p>
 
          {/* Channel row + actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pb-4 border-b border-[#2a2a2a]">
            {/* Channel info */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => owner?.username && navigate(`/profile/${owner.username}`)}
            >
              <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-[#ae7aff]">
                {owner?.avatar ? (
                  <img src={owner.avatar} alt={owner.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#ae7aff] text-black font-bold text-sm">
                    {owner?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-white text-sm font-semibold group-hover:text-[#ae7aff] transition">
                  {owner?.fullName || owner?.username || "Unknown"}
                </p>
                <p className="text-gray-400 text-xs">{formatViews(subCount)} subscribers</p>
              </div>
            </div>
 
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition
                  ${liked ? "bg-[#ae7aff] text-black" : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"}`}
              >
                <svg className="h-4 w-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeCount > 0 ? likeCount : ""} Like{likeCount !== 1 ? "s" : ""}
              </button>
 
              {/* ✅ Save to Playlist button — was commented out before */}
              <button
                onClick={() => setShowPlaylistModal(true)}
                className="flex items-center gap-2 rounded-full bg-[#2a2a2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a3a3a] transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Save
              </button>
 
              {/* Subscribe */}
              {!isOwner && (
                <button
                  onClick={handleSubscribe}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition
                    ${subscribed
                      ? "bg-[#2a2a2a] text-white hover:text-red-400 border border-[#444]"
                      : "bg-white text-black hover:bg-gray-200"
                    }`}
                >
                  {subscribed ? "Subscribed ✓" : "Subscribe"}
                </button>
              )}
            </div>
          </div>
 
          {/* Description */}
          {video.description && (
            <div className="mt-4 rounded-xl bg-[#1e1e1e] p-4">
              <p className={`text-gray-300 text-sm leading-relaxed whitespace-pre-wrap ${!descExpanded ? "line-clamp-3" : ""}`}>
                {video.description}
              </p>
              {video.description.length > 150 && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-white text-sm font-semibold mt-2 hover:text-[#ae7aff] transition"
                >
                  {descExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
 
          <CommentSection videoId={videoId} comments={video.comments || []} />
        </div>
 
        {/* Right panel */}
        <div className="xl:w-80 shrink-0">
          <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4">
            <p className="text-gray-400 text-sm font-semibold mb-3">Video Details</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Views</span>
                <span className="text-white">{formatViews(video.views)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uploaded</span>
                <span className="text-white">{formatDate(video.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Likes</span>
                <span className="text-white">{likeCount}</span>
              </div>
              {video.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-white">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      {/* ✅ Playlist modal — was commented out before */}
      {showPlaylistModal && (
        <AddToPlaylistModal
          videoId={videoId}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}
 
function VideoPlayerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="w-full aspect-video rounded-xl bg-[#2a2a2a] mb-4" />
      <div className="h-6 bg-[#2a2a2a] rounded w-2/3 mb-2" />
      <div className="h-4 bg-[#2a2a2a] rounded w-1/4 mb-4" />
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-[#2a2a2a]" />
        <div className="flex flex-col gap-1">
          <div className="h-4 bg-[#2a2a2a] rounded w-32" />
          <div className="h-3 bg-[#2a2a2a] rounded w-20" />
        </div>
      </div>
    </div>
  );
}
 

