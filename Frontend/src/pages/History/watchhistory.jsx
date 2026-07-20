// // src/pages/History/WatchHistory.jsx
// import { useState, useEffect } from "react";
// import { getWatchHistory } from "../../services/auth.api.js";
// import VideoCard from "../../components/videocard/videocard";

// export default function WatchHistory() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getWatchHistory()
//       .then((res) => setVideos(res.data?.data || []))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-white">Watch History</h1>
//         <p className="text-gray-400 text-sm mt-1">{videos.length} video{videos.length !== 1 ? "s" : ""} watched</p>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//           {Array(8).fill(0).map((_, i) => (
//             <div key={i} className="animate-pulse flex flex-col gap-2">
//               <div className="w-full aspect-video rounded-xl bg-[#2a2a2a]" />
//               <div className="h-3 bg-[#2a2a2a] rounded w-3/4" />
//               <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
//             </div>
//           ))}
//         </div>
//       ) : videos.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
//           <span className="text-5xl">🕐</span>
//           <p className="text-white font-semibold text-lg">No watch history yet</p>
//           <p className="text-gray-400 text-sm">Videos you watch will appear here</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//           {videos.map((v) => <VideoCard key={v._id} video={v} />)}
//         </div>
//       )}
//     </div>
//   );
// }
// src/pages/History/WatchHistory.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchHistory } from "../../services/auth.api.js";
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
  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  return `${mins}m ago`;
}

export default function WatchHistory() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getWatchHistory()
      .then((res) => {
        console.log("WATCH HISTORY RAW RESPONSE →", res.data);

        // Your backend returns: { statusCode: 200, data: [...videos] }
        // Try every possible path the data might be at
        const data =
          res.data?.data ||        // ApiResponse wrapper → data field
          res.data?.watchhistory || // direct watchhistory field
          res.data ||               // raw array
          [];

        // Make sure it's an array
        const list = Array.isArray(data) ? data : [];
        console.log("VIDEOS EXTRACTED →", list.length, list);
        setVideos(list);
      })
      .catch((err) => {
        console.error("Watch history error →", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Watch History</h1>
        <p className="text-gray-400 text-sm mt-1">
          {videos.length} video{videos.length !== 1 ? "s" : ""} watched
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-24 w-40 rounded-xl bg-[#2a2a2a] shrink-0" />
              <div className="flex flex-col gap-2 flex-1 pt-2">
                <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
                <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
                <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <span className="text-5xl">🕐</span>
          <p className="text-white font-semibold text-lg">No watch history yet</p>
          <p className="text-gray-400 text-sm">Videos you watch will appear here</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
          >
            Browse Videos
          </button>
        </div>
      )}

      {/* Video list — horizontal layout like YouTube history */}
      {!loading && videos.length > 0 && (
        <div className="flex flex-col gap-4">
          {videos.map((video) => {
            // Handle your exact backend field names
            const thumbnail = video?.Thumnil || video?.thumbnail || null;
            const videoUrl  = video?.videofile || video?.videoFile || null;
            const owner     = video?.owner || null;

            return (
              <div
                key={video._id}
                onClick={() => navigate(`/video/${video._id}`)}
                className="flex gap-4 rounded-xl p-3 hover:bg-[#1e1e1e] transition cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative h-24 w-40 shrink-0 rounded-xl overflow-hidden bg-[#2a2a2a]">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-600">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {/* Duration */}
                  {video.duration && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
                      {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center min-w-0 gap-1">
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
                    {video.title}
                  </p>
                  <p
                    className="text-gray-400 text-xs hover:text-white transition cursor-pointer w-fit"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (owner?.username) navigate(`/profile/${owner.username}`);
                    }}
                  >
                    {owner?.fullname || owner?.fullName || owner?.username || "Unknown"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatViews(video.views)} · {timeAgo(video.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}