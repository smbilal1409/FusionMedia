
// src/pages/Playlist/PlaylistView.jsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPlaylistById, removeVideoFromPlaylist, deletePlaylist } from "../../services/playlist.api";
// import { useAuth } from "../../Hooks/useauth";

// function formatDate(dateStr) {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
// }

// function formatViews(num) {
//   if (!num) return "0";
//   if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
//   if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
//   return String(num);
// }

// export default function PlaylistView() {
//   const { playlistId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [playlist, setPlaylist] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getPlaylistById(playlistId)
//       .then((res) => {
//         const data = res.data?.data;
//         setPlaylist(data);
//         setVideos(data?.videos || []);
//       })
//       .catch(() => navigate("/"))
//       .finally(() => setLoading(false));
//   }, [playlistId]);

//   const handleRemoveVideo = async (videoId) => {
//     if (!window.confirm("Remove this video from playlist?")) return;
//     try {
//       await removeVideoFromPlaylist(playlistId, videoId);
//       setVideos((prev) => prev.filter((v) => v._id !== videoId));
//     } catch {
//       alert("Failed to remove video");
//     }
//   };

//   const handleDeletePlaylist = async () => {
//     if (!window.confirm("Delete this entire playlist?")) return;
//     try {
//       await deletePlaylist(playlistId);
//       navigate("/playlists");
//     } catch {
//       alert("Failed to delete playlist");
//     }
//   };

//   // Check ownership — works whether owner is populated object or raw ID string
//   const isOwner = playlist ? (
//     // Case 1: owner is a populated object — compare _id or username
//     (user?._id && playlist?.owner?._id && String(user._id) === String(playlist.owner._id)) ||
//     (user?.username && playlist?.owner?.username && user.username === playlist.owner.username) ||
//     // Case 2: owner is just a raw ID string — compare directly
//     (user?._id && typeof playlist?.owner === "string" && String(user._id) === String(playlist.owner)) ||
//     // Case 3: check createdBy field (some backends use this)
//     (user?._id && playlist?.createdBy && String(user._id) === String(playlist.createdBy))
//   ) : false;

//   // Debug — remove after confirming it works
//   console.log("PLAYLIST OWNER →", playlist?.owner, "| USER →", user?._id, "| isOwner →", isOwner);

//   if (loading) return <PlaylistSkeleton />;
//   if (!playlist) return null;

//   // First video thumbnail for playlist cover — using your actual field names
//   const coverThumb = videos[0]?.Thumnil || videos[0]?.thumbnail || null;

//   return (
//     <div className="max-w-5xl mx-auto">
//       <div className="flex flex-col lg:flex-row gap-6">

//         {/* ── LEFT: Playlist info panel ── */}
//         <div className="lg:w-72 shrink-0">
//           <div className="rounded-2xl bg-gradient-to-b from-[#ae7aff]/20 to-[#1e1e1e] border border-[#2a2a2a] p-5 lg:sticky lg:top-20">
//             {/* Thumbnail */}
//             <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#2a2a2a] mb-4">
//               {coverThumb ? (
//                 <img src={coverThumb} alt={playlist.name} className="h-full w-full object-cover" />
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center text-4xl">📋</div>
//               )}
//             </div>

//             <h1 className="text-white font-bold text-lg leading-snug">{playlist.name}</h1>

//             {playlist.description && (
//               <p className="text-gray-400 text-sm mt-2 line-clamp-3">{playlist.description}</p>
//             )}

//             <div className="flex flex-col gap-1 mt-3 text-xs text-gray-500">
//               <span>{videos.length} video{videos.length !== 1 ? "s" : ""}</span>
//               {playlist.createdAt && <span>Created {formatDate(playlist.createdAt)}</span>}
//             </div>

//             {/* Play all button */}
//             {videos.length > 0 && (
//               <button
//                 onClick={() => navigate(`/video/${videos[0]._id}`)}
//                 className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#ae7aff] py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
//               >
//                 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//                 Play All
//               </button>
//             )}

//             {/* Owner actions */}
//             {isOwner && (
//               <button
//                 onClick={handleDeletePlaylist}
//                 className="mt-2 w-full rounded-xl border border-red-500/30 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
//               >
//                 Delete Playlist
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── RIGHT: Video list ── */}
//         <div className="flex-1 min-w-0">
//           <h2 className="text-white font-semibold mb-4">
//             {videos.length === 0 ? "No videos in this playlist" : "Videos"}
//           </h2>

//           {videos.length === 0 ? (
//             <div className="flex flex-col items-center py-16 gap-3 text-center">
//               <span className="text-4xl">🎬</span>
//               <p className="text-gray-400 text-sm">This playlist is empty</p>
//               <button
//                 onClick={() => navigate("/")}
//                 className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
//               >
//                 Browse videos to add
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-3">
//               {videos.map((video, index) => {
//                 const thumb = video?.Thumnil || video?.thumbnail || null;
//                 const owner = typeof video?.owner === "object" ? video.owner : null;

//                 return (
//                   <div
//                     key={video._id}
//                     className="flex gap-3 rounded-xl p-3 hover:bg-[#1e1e1e] transition group cursor-pointer"
//                     onClick={() => navigate(`/video/${video._id}`)}
//                   >
//                     {/* Index */}
//                     <div className="w-6 shrink-0 flex items-center justify-center text-gray-500 text-sm">
//                       {index + 1}
//                     </div>

//                     {/* Thumbnail */}
//                     <div className="relative h-20 w-36 shrink-0 rounded-lg overflow-hidden bg-[#2a2a2a]">
//                       {thumb ? (
//                         <img src={thumb} alt={video.title} className="h-full w-full object-cover" />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center text-gray-600 text-2xl">🎬</div>
//                       )}
//                       {video.duration && (
//                         <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
//                           {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
//                         </span>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0 flex flex-col justify-center">
//                       <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
//                       <p className="text-gray-400 text-xs mt-1">
//                         {owner?.fullName || owner?.fullname || owner?.username || "Unknown"}
//                       </p>
//                       <p className="text-gray-500 text-xs">
//                         {formatViews(video.views)} views · {formatDate(video.createdAt)}
//                       </p>
//                     </div>

//                     {/* Remove button (owner only) */}
//                     {isOwner && (
//                       <button
//                         onClick={(e) => { e.stopPropagation(); handleRemoveVideo(video._id); }}
//                         className="shrink-0 opacity-0 group-hover:opacity-100 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition self-center"
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function PlaylistSkeleton() {
//   return (
//     <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 animate-pulse">
//       <div className="lg:w-72 shrink-0">
//         <div className="rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-5">
//           <div className="w-full aspect-video rounded-xl bg-[#2a2a2a] mb-4" />
//           <div className="h-5 bg-[#2a2a2a] rounded w-3/4 mb-2" />
//           <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
//         </div>
//       </div>
//       <div className="flex-1 flex flex-col gap-3">
//         {Array(4).fill(0).map((_, i) => (
//           <div key={i} className="flex gap-3 p-3">
//             <div className="h-20 w-36 rounded-lg bg-[#2a2a2a] shrink-0" />
//             <div className="flex-1 flex flex-col gap-2 pt-2">
//               <div className="h-3 bg-[#2a2a2a] rounded w-3/4" />
//               <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// src/pages/Playlist/PlaylistView.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistById, removeVideoFromPlaylist, deletePlaylist } from "../../services/playlist.api";
import { useAuth } from "../../Hooks/useauth";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatViews(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

export default function PlaylistView() {
  const { playlistId } = useParams();
  console.log("PlaylistView loaded — playlistId:", playlistId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaylistById(playlistId)
      .then((res) => {
        const data = res.data?.data;
        setPlaylist(data);
        setVideos(data?.videos || []);
      })
      .catch((err) => {
        console.error("Playlist fetch error →", err);
        
      })
      .finally(() => setLoading(false));
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm("Remove this video from playlist?")) return;
    try {
      await removeVideoFromPlaylist(playlistId, videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch {
      alert("Failed to remove video");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Delete this entire playlist?")) return;
    try {
      await deletePlaylist(playlistId);
      navigate("/playlists");
    } catch {
      alert("Failed to delete playlist");
    }
  };

  // Check ownership — works whether owner is populated object or raw ID string
  const isOwner = playlist ? (
    // Case 1: owner is a populated object — compare _id or username
    (user?._id && playlist?.owner?._id && String(user._id) === String(playlist.owner._id)) ||
    (user?.username && playlist?.owner?.username && user.username === playlist.owner.username) ||
    // Case 2: owner is just a raw ID string — compare directly
    (user?._id && typeof playlist?.owner === "string" && String(user._id) === String(playlist.owner)) ||
    // Case 3: check createdBy field (some backends use this)
    (user?._id && playlist?.createdBy && String(user._id) === String(playlist.createdBy))
  ) : false;

  // Debug — remove after confirming it works
  console.log("PLAYLIST OWNER →", playlist?.owner, "| USER →", user?._id, "| isOwner →", isOwner);

  if (loading) return <PlaylistSkeleton />;
  if (!playlist) return null;

  // First video thumbnail for playlist cover — using your actual field names
  const coverThumb = videos[0]?.Thumnil || videos[0]?.thumbnail || null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── LEFT: Playlist info panel ── */}
        <div className="lg:w-72 shrink-0">
          <div className="rounded-2xl bg-gradient-to-b from-[#ae7aff]/20 to-[#1e1e1e] border border-[#2a2a2a] p-5 lg:sticky lg:top-20">
            {/* Thumbnail */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#2a2a2a] mb-4">
              {coverThumb ? (
                <img src={coverThumb} alt={playlist.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">📋</div>
              )}
            </div>

            <h1 className="text-white font-bold text-lg leading-snug">{playlist.name}</h1>

            {playlist.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-3">{playlist.description}</p>
            )}

            <div className="flex flex-col gap-1 mt-3 text-xs text-gray-500">
              <span>{videos.length} video{videos.length !== 1 ? "s" : ""}</span>
              {playlist.createdAt && <span>Created {formatDate(playlist.createdAt)}</span>}
            </div>

            {/* Play all button */}
            {videos.length > 0 && (
              <button
                onClick={() => navigate(`/video/${videos[0]._id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#ae7aff] py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play All
              </button>
            )}

            {/* Owner actions */}
            {isOwner && (
              <button
                onClick={handleDeletePlaylist}
                className="mt-2 w-full rounded-xl border border-red-500/30 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
              >
                Delete Playlist
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: Video list ── */}
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold mb-4">
            {videos.length === 0 ? "No videos in this playlist" : "Videos"}
          </h2>

          {videos.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-center">
              <span className="text-4xl">🎬</span>
              <p className="text-gray-400 text-sm">This playlist is empty</p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
              >
                Browse videos to add
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {videos.map((video, index) => {
                const thumb = video?.Thumnil || video?.thumbnail || null;
                const owner = typeof video?.owner === "object" ? video.owner : null;

                return (
                  <div
                    key={video._id}
                    className="flex gap-3 rounded-xl p-3 hover:bg-[#1e1e1e] transition group cursor-pointer"
                    onClick={() => navigate(`/video/${video._id}`)}
                  >
                    {/* Index */}
                    <div className="w-6 shrink-0 flex items-center justify-center text-gray-500 text-sm">
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-20 w-36 shrink-0 rounded-lg overflow-hidden bg-[#2a2a2a]">
                      {thumb ? (
                        <img src={thumb} alt={video.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-600 text-2xl">🎬</div>
                      )}
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
                          {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {owner?.fullName || owner?.fullname || owner?.username || "Unknown"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatViews(video.views)} views · {formatDate(video.createdAt)}
                      </p>
                    </div>

                    {/* Remove button (owner only) */}
                    {isOwner && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveVideo(video._id); }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition self-center"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 animate-pulse">
      <div className="lg:w-72 shrink-0">
        <div className="rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-5">
          <div className="w-full aspect-video rounded-xl bg-[#2a2a2a] mb-4" />
          <div className="h-5 bg-[#2a2a2a] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3 p-3">
            <div className="h-20 w-36 rounded-lg bg-[#2a2a2a] shrink-0" />
            <div className="flex-1 flex flex-col gap-2 pt-2">
              <div className="h-3 bg-[#2a2a2a] rounded w-3/4" />
              <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}