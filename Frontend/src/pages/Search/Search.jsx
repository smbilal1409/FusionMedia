
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getChannelVideos } from "../../services/dashboard.api.js";
// import VideoCard from "../../components/videocard/videocard.jsx";
// import Spinner from "../../components/UI/Spinner";

// export default function Search() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("search") || "";

//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [localQuery, setLocalQuery] = useState(query);

//   useEffect(() => {
//     if (!query.trim()) {
//       setVideos([]);
//       return;
//     }
//     setLoading(true);

//     // Search videos — filter client-side by title/description matching query
//     getChannelVideos()
//       .then((res) => {
//         const all = res.data?.data || [];
//         const filtered = all.filter((v) =>
//           v.title?.toLowerCase().includes(query.toLowerCase()) ||
//           v.description?.toLowerCase().includes(query.toLowerCase())
//         );
//         setVideos(filtered);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [query]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (localQuery.trim()) {
//       navigate(`/search?search=${encodeURIComponent(localQuery.trim())}`);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Search bar */}
//       <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
//         <input
//           value={localQuery}
//           onChange={(e) => setLocalQuery(e.target.value)}
//           placeholder="Search FusionMedia..."
//           className="flex-1 rounded-full border border-[#333] bg-[#1e1e1e] px-5 py-3 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
//         />
//         <button
//           type="submit"
//           className="rounded-full bg-[#ae7aff] px-6 py-3 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
//         >
//           Search
//         </button>
//       </form>

//       {/* No query yet */}
//       {!query && (
//         <div className="flex flex-col items-center py-24 gap-3 text-center">
//           <span className="text-5xl">🔍</span>
//           <p className="text-white font-semibold text-lg">Search FusionMedia</p>
//           <p className="text-gray-400 text-sm">Find videos by title or description</p>
//         </div>
//       )}

//       {/* Loading */}
//       {query && loading && <Spinner />}

//       {/* Results */}
//       {query && !loading && (
//         <>
//           <p className="text-gray-400 text-sm mb-4">
//             {videos.length} result{videos.length !== 1 ? "s" : ""} for{" "}
//             <span className="text-white font-semibold">"{query}"</span>
//           </p>

//           {videos.length === 0 ? (
//             <div className="flex flex-col items-center py-20 gap-3 text-center">
//               <span className="text-5xl">😕</span>
//               <p className="text-white font-semibold">No results found</p>
//               <p className="text-gray-400 text-sm">Try different keywords</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {videos.map((v) => (
//                 <VideoCard key={v._id} video={v} />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
// src/pages/Search/Search.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllVideos } from "../../services/video.api.js";
import VideoCard from "../../components/videocard/videocard.jsx";
import Spinner from "../../components/UI/Spinner";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("search") || "";

  const [videos, setVideos]           = useState([]);
  const [channels, setChannels]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [localQuery, setLocalQuery]   = useState(query);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Videos", "Channels"];

  useEffect(() => {
    setLocalQuery(query);
    if (!query.trim()) { setVideos([]); setChannels([]); return; }
    setLoading(true);

    // ✅ Search ALL videos and extract unique channels
    getAllVideos()
      .then((res) => {
        const all = res.data?.data || [];

        // Filter videos by title or description
        const filteredVideos = all.filter((v) =>
          v.title?.toLowerCase().includes(query.toLowerCase()) ||
          v.description?.toLowerCase().includes(query.toLowerCase())
        );

        // Extract unique channels matching the search query
        const channelMap = {};
        all.forEach((v) => {
          const owner = typeof v.owner === "object" ? v.owner : null;
          if (!owner) return;
          if (
            owner.username?.toLowerCase().includes(query.toLowerCase()) ||
            owner.fullName?.toLowerCase().includes(query.toLowerCase()) ||
            owner.fullname?.toLowerCase().includes(query.toLowerCase())
          ) {
            if (!channelMap[owner._id]) {
              channelMap[owner._id] = owner;
            }
          }
        });

        setVideos(filteredVideos);
        setChannels(Object.values(channelMap));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const showVideos   = activeFilter === "All" || activeFilter === "Videos";
  const showChannels = activeFilter === "All" || activeFilter === "Channels";
  const totalResults = videos.length + channels.length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
        <input
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search videos, channels, people..."
          className="flex-1 rounded-full border border-[#333] bg-[#1e1e1e] px-5 py-3 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-[#ae7aff] px-6 py-3 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
        >
          Search
        </button>
      </form>

      {/* No query yet */}
      {!query && (
        <div className="flex flex-col items-center py-24 gap-3 text-center">
          <span className="text-5xl">🔍</span>
          <p className="text-white font-semibold text-lg">Search FusionMedia</p>
          <p className="text-gray-400 text-sm">Find videos, channels and people</p>
        </div>
      )}

      {/* Loading */}
      {query && loading && <Spinner />}

      {/* Results */}
      {query && !loading && (
        <>
          {/* Filter pills */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition
                  ${activeFilter === f
                    ? "bg-white text-black"
                    : "bg-[#1e1e1e] text-gray-400 border border-[#333] hover:border-white hover:text-white"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="text-gray-400 text-sm mb-6">
            {totalResults} result{totalResults !== 1 ? "s" : ""} for{" "}
            <span className="text-white font-semibold">"{query}"</span>
          </p>

          {totalResults === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-center">
              <span className="text-5xl">😕</span>
              <p className="text-white font-semibold">No results found</p>
              <p className="text-gray-400 text-sm">Try a different username or video title</p>
            </div>
          ) : (
            <>
              {/* ✅ Channels section — click to visit any user's profile */}
              {showChannels && channels.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-white font-semibold text-lg mb-4">Channels</h2>
                  <div className="flex flex-col gap-3">
                    {channels.map((ch) => (
                      <div
                        key={ch._id}
                        onClick={() => navigate(`/profile/${ch.username}`)}
                        className="flex items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 cursor-pointer hover:border-[#ae7aff] transition"
                      >
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#2a2a2a] shrink-0">
                          {ch.avatar ? (
                            <img src={ch.avatar} alt={ch.username} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#ae7aff] bg-[#2a2a2a]">
                              {ch.username?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm">
                            {ch.fullName || ch.fullname || ch.username}
                          </p>
                          <p className="text-gray-400 text-xs">@{ch.username}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/profile/${ch.username}`); }}
                          className="shrink-0 rounded-full bg-white text-black text-xs font-semibold px-4 py-1.5 hover:bg-gray-200 transition"
                        >
                          View Channel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos section */}
              {showVideos && videos.length > 0 && (
                <div>
                  <h2 className="text-white font-semibold text-lg mb-4">Videos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {videos.map((v) => (
                      <VideoCard key={v._id} video={v} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}