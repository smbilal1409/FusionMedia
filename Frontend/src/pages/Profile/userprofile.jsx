
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../Hooks/useauth";
// import { getChannelProfile } from "../../services/auth.api.js";
// import { toggleSubscription } from "../../services/subscription.api.js";
// import { getChannelVideos } from "../../services/dashboard.api.js";
// import { getUserPlaylists } from "../../services/playlist.api.js";
// import VideoCard from "../../components/videocard/videocard.jsx";
// import TweetCard from "../../components/Tweetcard/tweetcard.jsx";


// const TABS = ["Videos", "Playlists", "About"];

// function formatCount(num) {
//   if (!num) return "0";
//   if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
//   if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
//   return num;
// }

// export default function UserProfile() {
//   const { username } = useParams();
//   const { user: currentUser } = useAuth();
//   const navigate = useNavigate();

//   const [channel, setChannel] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [subscribed, setSubscribed] = useState(false);
//   const [subCount, setSubCount] = useState(0);
//   const [activeTab, setActiveTab] = useState("Videos");

//   const isOwner = currentUser?.username === username;

//   useEffect(() => {
//     setLoading(true);
//     getChannelProfile(username)
//       .then((res) => {
//         const ch = res.data?.data;
//         setChannel(ch);
//         setSubscribed(ch?.isSubscribed || false);
//         setSubCount(ch?.subscribersCount || 0);
//       })
//       .catch(() => navigate("/"))
//       .finally(() => setLoading(false));

//     // load videos
//     getChannelVideos()
//       .then((res) => setVideos(res.data?.data || []))
//       .catch(console.error);
//   }, [username]);

//   // load playlists when tab switches
//   useEffect(() => {
//     if (activeTab === "Playlists" && channel?._id) {
//       getUserPlaylists(channel._id)
//         .then((res) => setPlaylists(res.data?.data || []))
//         .catch(console.error);
//     }
//   }, [activeTab, channel]);

//   const handleSubscribe = async () => {
//     try {
//       await toggleSubscription(channel._id);
//       setSubscribed(!subscribed);
//       setSubCount((c) => (subscribed ? c - 1 : c + 1));
//     } catch {
//       alert("Failed to toggle subscription");
//     }
//   };

//   if (loading) return <ProfileSkeleton />;
//   if (!channel) return null;

//   return (
//     <div className="max-w-5xl mx-auto">

//       {/* Cover image */}
//       <div className="relative w-full h-45 sm:h-60 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] shadow-xl">
//         {channel.coverimage && (
//           <img src={channel.coverimage} alt="Cover" className="h-full w-full object-cover" />
//         )}
//         {/* Edit cover button for owner */}
//         {isOwner && (
//           <button
//             onClick={() => navigate("/settings")}
//             className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white hover:bg-black/80 transition"
//           >
//             Edit cover
//           </button>
//         )}
//       </div>

//       {/* Avatar + info row */}
//       <div className="flex flex-col sm:flex-row gap-5 px-6 mt-4 mb-8">
//         {/* Avatar */}
//        <div className="h-32 w-32 rounded-full border-[5px] border-[#121212] overflow-hidden bg-[#2a2a2a] shrink-0 shadow-2xl">
//           {channel.avatar ? (
//             <img src={channel.avatar} alt={channel.username} className="h-full w-full object-cover" />
//           ) : (
//             <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#ae7aff]">
//               {channel.username?.[0]?.toUpperCase()}
//             </div>
//           )}
//         </div>

//         {/* Name + stats + buttons */}
//        <div className="flex flex-1 flex-col sm:flex-row sm:items-end justify-between gap-4 ">
//           <div>
//             <h1 className="text-3xl font-bold text-white tracking-wide">{channel.fullname}</h1>
//             <p className="text-gray-400 text-base">@{channel.username}</p>
//             <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-400">
//               <span><span className="text-white font-semibold">{formatCount(subCount)}</span> subscribers</span>
//               <span><span className="text-white font-semibold">{formatCount(channel.channelsSubscribedToCount)}</span> subscriptions</span>
//               <span><span className="text-white font-semibold">{videos.length}</span> videos</span>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex items-center gap-3">
//             {isOwner ? (
//               <>
//                 <button
//                   onClick={() => navigate("/settings")}
//                   className="rounded-full border border-[#333] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition"
//                 >
//                   Edit Profile
//                 </button>
//                 <button
//                   onClick={() => navigate("/dashboard")}
//                   className="rounded-full bg-[#ae7aff] px-4 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
//                 >
//                   Dashboard
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handleSubscribe}
//                 className={`rounded-full px-5 py-2 text-sm font-semibold transition
//                   ${subscribed
//                     ? "bg-[#2a2a2a] text-white hover:bg-red-500/10 hover:text-red-400"
//                     : "bg-white text-black hover:bg-gray-200"
//                   }`}
//               >
//                 {subscribed ? "Subscribed ✓" : "Subscribe"}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
//         {TABS.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-5 py-2.5 text-sm font-semibold transition border-b-2 -mb-px
//               ${activeTab === tab
//                 ? "border-[#ae7aff] text-[#ae7aff]"
//                 : "border-transparent text-gray-400 hover:text-white"
//               }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Videos tab */}
//       {activeTab === "Videos" && (
//         videos.length === 0 ? (
//           <div className="flex flex-col items-center py-20 gap-3 text-center">
//             <span className="text-4xl">🎬</span>
//             <p className="text-white font-semibold">No videos yet</p>
//             {isOwner && (
//               <button
//                 onClick={() => navigate("/upload")}
//                 className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
//               >
//                 Upload your first video
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {videos.map((v) => <VideoCard key={v._id} video={v} />)}
//           </div>
//         )
//       )}

//       {/* Playlists tab */}
//       {activeTab === "Playlists" && (
//         playlists.length === 0 ? (
//           <div className="flex flex-col items-center py-20 gap-3 text-center">
//             <span className="text-4xl">📋</span>
//             <p className="text-white font-semibold">No playlists yet</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {playlists.map((pl) => (
//               <div
//                 key={pl._id}
//                 onClick={() => navigate(`/playlist/${pl._id}`)}
//                 className="cursor-pointer rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 hover:border-[#ae7aff] transition"
//               >
//                 <div className="w-full aspect-video rounded-lg bg-[#2a2a2a] mb-3 overflow-hidden">
//                   {pl.thumbnail ? (
//                     <img src={pl.thumbnail} alt={pl.name} className="h-full w-full object-cover" />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center text-gray-600 text-3xl">📋</div>
//                   )}
//                 </div>
//                 <p className="text-white text-sm font-semibold line-clamp-1">{pl.name}</p>
//                 <p className="text-gray-400 text-xs mt-1">{pl.videosCount || 0} videos</p>
//               </div>
//             ))}
//           </div>
//         )
//       )}

//       {/* About tab */}
//       {activeTab === "About" && (
//         <div className="max-w-xl flex flex-col gap-5">
//           <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-5 flex flex-col gap-3">
//             <h3 className="text-white font-semibold">Channel Info</h3>
//             <div className="flex flex-col gap-2 text-sm">
//               <div className="flex gap-3">
//                 <span className="text-gray-500 w-28 shrink-0">Full Name</span>
//                 <span className="text-white">{channel.fullname}</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-gray-500 w-28 shrink-0">Username</span>
//                 <span className="text-white">@{channel.username}</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-gray-500 w-28 shrink-0">Email</span>
//                 <span className="text-white">{channel.email || "—"}</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-gray-500 w-28 shrink-0">Subscribers</span>
//                 <span className="text-white">{formatCount(subCount)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// function ProfileSkeleton() {
//   return (
//     <div className="max-w-5xl mx-auto animate-pulse">
//       <div className="w-full h-52 rounded-2xl bg-[#2a2a2a] mb-4" />
//       <div className="flex gap-4 px-2 -mt-10 mb-6">
//         <div className="h-24 w-24 rounded-full bg-[#2a2a2a] shrink-0" />
//         <div className="flex flex-col gap-2 pt-12">
//           <div className="h-5 w-40 bg-[#2a2a2a] rounded" />
//           <div className="h-3 w-24 bg-[#2a2a2a] rounded" />
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Profile/UserProfile.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useauth";
import { getChannelProfile } from "../../services/auth.api.js";
import { toggleSubscription } from "../../services/subscription.api.js";
import { getAllVideos } from "../../services/video.api.js";
import { getTweets } from "../../services/tweet.api.js";
import { getUserPlaylists } from "../../services/playlist.api.js";
import VideoCard from "../../components/videocard/videocard.jsx";
import TweetCard from "../../components/Tweetcard/tweetcard.jsx";

const TABS = ["Videos", "Tweets", "Playlists", "About"];

function formatCount(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
}

export default function UserProfile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel]       = useState(null);
  const [videos, setVideos]         = useState([]);
  const [tweets, setTweets]         = useState([]);
  const [playlists, setPlaylists]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount]     = useState(0);
  const [activeTab, setActiveTab]   = useState("Videos");

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    setLoading(true);
    // Get channel profile
    getChannelProfile(username)
      .then((res) => {
        const ch = res.data?.data;
        setChannel(ch);
        setSubscribed(ch?.isSubscribed || false);
        setSubCount(ch?.subscribersCount || 0);

        // ✅ Get ALL videos then filter by this channel's username
        getAllVideos()
          .then((vRes) => {
            const all = vRes.data?.data || [];
            const filtered = all.filter((v) => {
              const owner = typeof v.owner === "object" ? v.owner : null;
              return owner?.username === username;
            });
            setVideos(filtered);
          })
          .catch(console.error);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [username]);

  // Load tweets and playlists when tab switches
  useEffect(() => {
    if (activeTab === "Tweets") {
      // ✅ Get tweets by this channel's username
      getTweets(username)
        .then((res) => setTweets(res.data?.data || []))
        .catch(console.error);
    }
    if (activeTab === "Playlists" && channel?._id) {
      getUserPlaylists(channel._id)
        .then((res) => setPlaylists(res.data?.data || []))
        .catch(console.error);
    }
  }, [activeTab, channel, username]);

  const handleSubscribe = async () => {
    try {
      await toggleSubscription(channel._id);
      setSubscribed(!subscribed);
      setSubCount((c) => (subscribed ? c - 1 : c + 1));
    } catch {
      alert("Failed to toggle subscription");
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!channel) return null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover image */}
      <div className="relative w-full h-45 sm:h-60 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] shadow-xl">
        {channel.coverimage && (
          <img src={channel.coverimage} alt="Cover" className="h-full w-full object-cover" />
        )}
        {isOwner && (
          <button
            onClick={() => navigate("/settings")}
            className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white hover:bg-black/80 transition"
          >
            Edit cover
          </button>
        )}
      </div>

      {/* Avatar + info row */}
      <div className="flex flex-col sm:flex-row gap-5 px-6 mt-4 mb-8">
        <div className="h-32 w-32 rounded-full border-[5px] border-[#121212] overflow-hidden bg-[#2a2a2a] shrink-0 shadow-2xl">
          {channel.avatar ? (
            <img src={channel.avatar} alt={channel.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#ae7aff]">
              {channel.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              {channel.fullname || channel.fullName}
            </h1>
            <p className="text-gray-400 text-base">@{channel.username}</p>
            <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-400">
              <span><span className="text-white font-semibold">{formatCount(subCount)}</span> subscribers</span>
              <span><span className="text-white font-semibold">{formatCount(channel.channelsSubscribedToCount)}</span> subscriptions</span>
              <span><span className="text-white font-semibold">{videos.length}</span> videos</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwner ? (
              <>
                <button
                  onClick={() => navigate("/settings")}
                  className="rounded-full border border-[#333] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full bg-[#ae7aff] px-4 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
                >
                  Dashboard
                </button>
              </>
            ) : (
              // ✅ Subscribe button shows for other users
              <button
                onClick={handleSubscribe}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition
                  ${subscribed
                    ? "bg-[#2a2a2a] text-white hover:bg-red-500/10 hover:text-red-400 border border-[#444]"
                    : "bg-white text-black hover:bg-gray-200"
                  }`}
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold transition border-b-2 -mb-px
              ${activeTab === tab
                ? "border-[#ae7aff] text-[#ae7aff]"
                : "border-transparent text-gray-400 hover:text-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Videos tab */}
      {activeTab === "Videos" && (
        videos.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3 text-center">
            <span className="text-4xl">🎬</span>
            <p className="text-white font-semibold">No videos yet</p>
            {isOwner && (
              <button
                onClick={() => navigate("/upload")}
                className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
              >
                Upload your first video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => <VideoCard key={v._id} video={v} />)}
          </div>
        )
      )}

      {/* Tweets tab — shows this channel's tweets */}
      {activeTab === "Tweets" && (
        tweets.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3 text-center">
            <span className="text-4xl">✍️</span>
            <p className="text-white font-semibold">No tweets yet</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#2a2a2a] overflow-hidden">
            {tweets.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        )
      )}

      {/* Playlists tab */}
      {activeTab === "Playlists" && (
        playlists.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3 text-center">
            <span className="text-4xl">📋</span>
            <p className="text-white font-semibold">No playlists yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {playlists.map((pl) => (
              <div
                key={pl._id}
                onClick={() => navigate(`/playlist/${pl._id}`)}
                className="cursor-pointer rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 hover:border-[#ae7aff] transition"
              >
                <div className="w-full aspect-video rounded-lg bg-[#2a2a2a] mb-3 overflow-hidden">
                  {pl.thumbnail ? (
                    <img src={pl.thumbnail} alt={pl.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-600 text-3xl">📋</div>
                  )}
                </div>
                <p className="text-white text-sm font-semibold line-clamp-1">{pl.name}</p>
                <p className="text-gray-400 text-xs mt-1">{pl.videosCount || 0} videos</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* About tab */}
      {activeTab === "About" && (
        <div className="max-w-xl flex flex-col gap-5">
          <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-5 flex flex-col gap-3">
            <h3 className="text-white font-semibold">Channel Info</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex gap-3">
                <span className="text-gray-500 w-28 shrink-0">Full Name</span>
                <span className="text-white">{channel.fullname || channel.fullName}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-500 w-28 shrink-0">Username</span>
                <span className="text-white">@{channel.username}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-500 w-28 shrink-0">Email</span>
                <span className="text-white">{channel.email || "—"}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-500 w-28 shrink-0">Subscribers</span>
                <span className="text-white">{formatCount(subCount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="w-full h-52 rounded-2xl bg-[#2a2a2a] mb-4" />
      <div className="flex gap-4 px-2 -mt-10 mb-6">
        <div className="h-24 w-24 rounded-full bg-[#2a2a2a] shrink-0" />
        <div className="flex flex-col gap-2 pt-12">
          <div className="h-5 w-40 bg-[#2a2a2a] rounded" />
          <div className="h-3 w-24 bg-[#2a2a2a] rounded" />
        </div>
      </div>
    </div>
  );
}