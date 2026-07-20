
// import { useState, useEffect } from "react";
// import { useAuth } from "../../Hooks/useauth";
// import { getChannelVideos } from "../../services/dashboard.api.js";
// import { getTweets } from "../../services/tweet.api.js";
// import VideoCard from "../../components/videocard/videocard.jsx";
// import TweetCard from "../../components/Tweetcard/tweetcard.jsx";
// import { deleteTweet } from "../../services/tweet.api.js";

// const TABS = ["Videos", "Tweets"];

// export default function Home() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("Videos");
//   const [videos, setVideos] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [loadingVideos, setLoadingVideos] = useState(true);
//   const [loadingTweets, setLoadingTweets] = useState(false);
//   const [editingTweet, setEditingTweet] = useState(null);

//   // Load videos on mount
//   useEffect(() => {
//     getChannelVideos()
//       .then((res) => setVideos(res.data?.data || []))
//       .catch(console.error)
//       .finally(() => setLoadingVideos(false));
//   }, []);

//   // Load tweets when tab switches
//   useEffect(() => {
//     if (activeTab === "Tweets" && user?.username) {
//       setLoadingTweets(true);
//       getTweets(user.username)
//         .then((res) => setTweets(res.data?.data || []))
//         .catch(console.error)
//         .finally(() => setLoadingTweets(false));
//     }
//   }, [activeTab, user]);

//   const handleDeleteTweet = async (tweetId) => {
//     if (!window.confirm("Delete this tweet?")) return;
//     try {
//       await deleteTweet(user.username, tweetId);
//       setTweets((prev) => prev.filter((t) => t._id !== tweetId));
//     } catch (err) {
//       alert("Failed to delete tweet");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
//       {/* Welcome banner */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-white">
//           Welcome back, <span className="text-[#ae7aff]">{user?.fullName?.split(" ")[0]}</span> 👋
//         </h1>
//         <p className="text-gray-400 text-sm mt-1">Here's what's happening on FusionMedia</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 mb-6 border-b border-[#2a2a2a]">
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

//       {/* ── VIDEOS TAB ── */}
//       {activeTab === "Videos" && (
//         <>
//           {loadingVideos ? (
//             <VideoSkeleton />
//           ) : videos.length === 0 ? (
//             <EmptyState
//               icon="🎬"
//               title="No videos yet"
//               subtitle="Upload your first video to get started"
//               action={{ label: "Upload Video", path: "/upload" }}
//             />
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//               {videos.map((video) => (
//                 <VideoCard key={video._id} video={video} />
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* ── TWEETS TAB ── */}
//       {activeTab === "Tweets" && (
//         <div className="max-w-2xl mx-auto">
//           {/* Compose box */}
//           <ComposeBox user={user} onPost={(tweet) => setTweets([tweet, ...tweets])} />

//           {loadingTweets ? (
//             <TweetSkeleton />
//           ) : tweets.length === 0 ? (
//             <EmptyState
//               icon="✍️"
//               title="No tweets yet"
//               subtitle="Share what's on your mind"
//             />
//           ) : (
//             <div className="mt-2">
//               {tweets.map((tweet) => (
//                 <TweetCard
//                   key={tweet._id}
//                   tweet={tweet}
//                   onDelete={handleDeleteTweet}
//                   onEdit={setEditingTweet}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Edit tweet modal */}
//       {editingTweet && (
//         <EditTweetModal
//           tweet={editingTweet}
//           user={user}
//           onClose={() => setEditingTweet(null)}
//           onUpdated={(updated) => {
//             setTweets((prev) =>
//               prev.map((t) => (t._id === updated._id ? updated : t))
//             );
//             setEditingTweet(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // ── Compose box (create tweet inline) ─────────────────────────────────────
// import { createTweet } from "../../services/tweet.api.js";

// function ComposeBox({ user, onPost }) {
//   const [content, setContent] = useState("");
//   const [posting, setPosting] = useState(false);

//   const submit = async () => {
//     if (!content.trim()) return;
//     setPosting(true);
//     try {
//       const res = await createTweet({ content });
//       onPost(res.data?.data);
//       setContent("");
//     } catch (err) {
//       alert("Failed to post tweet");
//     } finally {
//       setPosting(false);
//     }
//   };

//   return (
//     <div className="flex gap-3 p-4 border border-[#2a2a2a] rounded-xl mb-4 bg-[#1a1a1a]">
//       <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a]">
//         {user?.avatar ? (
//           <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#ae7aff]">
//             {user?.username?.[0]?.toUpperCase()}
//           </div>
//         )}
//       </div>
//       <div className="flex-1 flex flex-col gap-3">
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="What's happening?"
//           rows={3}
//           className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none focus:outline-none border-b border-[#2a2a2a] pb-2"
//         />
//         <div className="flex justify-between items-center">
//           <span className={`text-xs ${content.length > 250 ? "text-red-400" : "text-gray-500"}`}>
//             {content.length}/280
//           </span>
//           <button
//             onClick={submit}
//             disabled={posting || !content.trim() || content.length > 280}
//             className="rounded-full bg-[#ae7aff] px-5 py-1.5 text-sm font-semibold text-black hover:bg-[#9b63e5] disabled:opacity-50 transition"
//           >
//             {posting ? "Posting..." : "Post"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Edit Tweet Modal ───────────────────────────────────────────────────────
// import { updateTweet } from "../../services/tweet.api.js";

// function EditTweetModal({ tweet, user, onClose, onUpdated }) {
//   const [content, setContent] = useState(tweet.content);
//   const [saving, setSaving] = useState(false);

//   const save = async () => {
//     setSaving(true);
//     try {
//       const res = await updateTweet(user.username, tweet._id, { content });
//       onUpdated(res.data?.data);
//     } catch {
//       alert("Failed to update tweet");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-6">
//         <h3 className="text-white font-semibold mb-4">Edit Tweet</h3>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           rows={4}
//           className="w-full rounded-xl border border-[#333] bg-[#121212] px-3 py-2 text-white text-sm resize-none focus:border-[#ae7aff] focus:outline-none"
//         />
//         <div className="flex gap-3 mt-4 justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={save}
//             disabled={saving}
//             className="px-5 py-2 rounded-xl bg-[#ae7aff] text-black text-sm font-semibold hover:bg-[#9b63e5] disabled:opacity-50 transition"
//           >
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Skeleton loaders ───────────────────────────────────────────────────────
// function VideoSkeleton() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//       {Array(8).fill(0).map((_, i) => (
//         <div key={i} className="flex flex-col gap-2 animate-pulse">
//           <div className="w-full aspect-video rounded-xl bg-[#2a2a2a]" />
//           <div className="flex gap-2">
//             <div className="h-9 w-9 rounded-full bg-[#2a2a2a] shrink-0" />
//             <div className="flex flex-col gap-1.5 flex-1">
//               <div className="h-3 rounded bg-[#2a2a2a] w-full" />
//               <div className="h-3 rounded bg-[#2a2a2a] w-2/3" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function TweetSkeleton() {
//   return (
//     <div className="flex flex-col gap-3 mt-2">
//       {Array(4).fill(0).map((_, i) => (
//         <div key={i} className="flex gap-3 p-4 border-b border-[#2a2a2a] animate-pulse">
//           <div className="h-10 w-10 rounded-full bg-[#2a2a2a] shrink-0" />
//           <div className="flex-1 flex flex-col gap-2">
//             <div className="h-3 rounded bg-[#2a2a2a] w-1/3" />
//             <div className="h-3 rounded bg-[#2a2a2a] w-full" />
//             <div className="h-3 rounded bg-[#2a2a2a] w-2/3" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Empty state ────────────────────────────────────────────────────────────
// import { useNavigate } from "react-router-dom";

// function EmptyState({ icon, title, subtitle, action }) {
//   const navigate = useNavigate();
//   return (
//     <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
//       <span className="text-5xl">{icon}</span>
//       <p className="text-white font-semibold text-lg">{title}</p>
//       <p className="text-gray-400 text-sm">{subtitle}</p>
//       {action && (
//         <button
//           onClick={() => navigate(action.path)}
//           className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
//         >
//           {action.label}
//         </button>
//       )}
//     </div>
//   );
// }

// src/pages/Feed/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useauth";
import { getAllVideos } from "../../services/video.api.js";
import { getAllTweets, createTweet, updateTweet, deleteTweet } from "../../services/tweet.api.js";
import VideoCard from "../../components/videocard/videocard.jsx";
import TweetCard from "../../components/Tweetcard/tweetcard.jsx";

const TABS = ["Videos", "Tweets"];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Videos");
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);

  // ✅ Load ALL videos from ALL users on mount
  useEffect(() => {
    getAllVideos()
      .then((res) => setVideos(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoadingVideos(false));
  }, []);

  // ✅ Load ALL tweets from ALL users when tab switches
  useEffect(() => {
    if (activeTab === "Tweets") {
      setLoadingTweets(true);
      getAllTweets()
        .then((res) => setTweets(res.data?.data || []))
        .catch(console.error)
        .finally(() => setLoadingTweets(false));
    }
  }, [activeTab]);

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await deleteTweet(user.username, tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch {
      alert("Failed to delete tweet");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-[#ae7aff]">{user?.fullName?.split(" ")[0] || user?.username}</span> 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening on FusionMedia</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#2a2a2a]">
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

      {/* VIDEOS TAB */}
      {activeTab === "Videos" && (
        <>
          {loadingVideos ? (
            <VideoSkeleton />
          ) : videos.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No videos yet"
              subtitle="Be the first to upload a video!"
              action={{ label: "Upload Video", path: "/upload" }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </>
      )}

      {/* TWEETS TAB */}
      {activeTab === "Tweets" && (
        <div className="max-w-2xl mx-auto">
          <ComposeBox user={user} onPost={(tweet) => setTweets([{ ...tweet, owner: user }, ...tweets])} />

          {loadingTweets ? (
            <TweetSkeleton />
          ) : tweets.length === 0 ? (
            <EmptyState icon="✍️" title="No tweets yet" subtitle="Share what's on your mind" />
          ) : (
            <div className="mt-2">
              {tweets.map((tweet) => (
                <TweetCard
                  key={tweet._id}
                  tweet={tweet}
                  onDelete={handleDeleteTweet}
                  onEdit={setEditingTweet}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit tweet modal */}
      {editingTweet && (
        <EditTweetModal
          tweet={editingTweet}
          user={user}
          onClose={() => setEditingTweet(null)}
          onUpdated={(updated) => {
            setTweets((prev) =>
              prev.map((t) => (t._id === updated._id ? updated : t))
            );
            setEditingTweet(null);
          }}
        />
      )}
    </div>
  );
}

function ComposeBox({ user, onPost }) {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const res = await createTweet({ content });
      onPost(res.data?.data);
      setContent("");
    } catch {
      alert("Failed to post tweet");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex gap-3 p-4 border border-[#2a2a2a] rounded-xl mb-4 bg-[#1a1a1a]">
      <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a]">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#ae7aff]">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none focus:outline-none border-b border-[#2a2a2a] pb-2"
        />
        <div className="flex justify-between items-center">
          <span className={`text-xs ${content.length > 250 ? "text-red-400" : "text-gray-500"}`}>
            {content.length}/280
          </span>
          <button
            onClick={submit}
            disabled={posting || !content.trim() || content.length > 280}
            className="rounded-full bg-[#ae7aff] px-5 py-1.5 text-sm font-semibold text-black hover:bg-[#9b63e5] disabled:opacity-50 transition"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditTweetModal({ tweet, user, onClose, onUpdated }) {
  const [content, setContent] = useState(tweet.content);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await updateTweet(user.username, tweet._id, { content });
      onUpdated(res.data?.data || { ...tweet, content });
    } catch {
      alert("Failed to update tweet");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-6">
        <h3 className="text-white font-semibold mb-4">Edit Tweet</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-[#333] bg-[#121212] px-3 py-2 text-white text-sm resize-none focus:border-[#ae7aff] focus:outline-none"
        />
        <div className="flex gap-3 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#ae7aff] text-black text-sm font-semibold hover:bg-[#9b63e5] disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="w-full aspect-video rounded-xl bg-[#2a2a2a]" />
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-full bg-[#2a2a2a] shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 rounded bg-[#2a2a2a] w-full" />
              <div className="h-3 rounded bg-[#2a2a2a] w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TweetSkeleton() {
  return (
    <div className="flex flex-col gap-3 mt-2">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex gap-3 p-4 border-b border-[#2a2a2a] animate-pulse">
          <div className="h-10 w-10 rounded-full bg-[#2a2a2a] shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 rounded bg-[#2a2a2a] w-1/3" />
            <div className="h-3 rounded bg-[#2a2a2a] w-full" />
            <div className="h-3 rounded bg-[#2a2a2a] w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <span className="text-5xl">{icon}</span>
      <p className="text-white font-semibold text-lg">{title}</p>
      <p className="text-gray-400 text-sm">{subtitle}</p>
      {action && (
        <button
          onClick={() => navigate(action.path)}
          className="mt-2 rounded-full bg-[#ae7aff] px-5 py-2 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}