
import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useauth.js";
import { getTweets, createTweet, updateTweet, deleteTweet } from "../../services/tweet.api.js";
import TweetCard from "../../components/Tweetcard/tweetcard.jsx";
import toast from "react-hot-toast";
export default function TweetFeed() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);

  useEffect(() => {
    if (!user?.username) return;
    getTweets(user.username)
      .then((res) => setTweets(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handlePost = async () => {
    if (!content.trim() || content.length > 280) return;
    setPosting(true);
    try {
      const res = await createTweet({ content });
      const newTweet = { ...res.data?.data, owner: user };
      setTweets((prev) => [newTweet, ...prev]);
      setContent("");
    } catch {
      toast.error("Failed to post tweet");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await deleteTweet(user.username, tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (error) {
    console.log(error);
    console.log(error.response);
    console.log(error.response?.data);

    toast.error("Failed to post tweet");
}
  };

  const handleUpdate = async (updated) => {
    setTweets((prev) =>
      prev.map((t) => (t._id === updated._id ? { ...t, content: updated.content } : t))
    );
    setEditingTweet(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tweets</h1>
        <p className="text-gray-400 text-sm mt-1">Share what's on your mind</p>
      </div>

      {/* Compose box */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 mb-6">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a]">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#ae7aff]">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none focus:outline-none border-b border-[#2a2a2a] pb-2"
            />
            <div className="flex items-center justify-between">
              {/* Character counter */}
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke={content.length > 260 ? (content.length > 280 ? "#ef4444" : "#f59e0b") : "#ae7aff"}
                    strokeWidth="3"
                    strokeDasharray={`${(content.length / 280) * 100} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                {content.length > 240 && (
                  <span className={`text-xs ${content.length > 280 ? "text-red-400" : "text-gray-400"}`}>
                    {280 - content.length}
                  </span>
                )}
              </div>

              <button
                onClick={handlePost}
                disabled={posting || !content.trim() || content.length > 280}
                className="rounded-full bg-[#ae7aff] px-5 py-1.5 text-sm font-semibold text-black hover:bg-[#9b63e5] disabled:opacity-50 transition"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tweet list */}
      {loading ? (
        <TweetSkeleton />
      ) : tweets.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3 text-center">
          <span className="text-5xl">✍️</span>
          <p className="text-white font-semibold text-lg">No tweets yet</p>
          <p className="text-gray-400 text-sm">Be the first to share something!</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#2a2a2a] overflow-hidden">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onDelete={handleDelete}
              onEdit={setEditingTweet}
            />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingTweet && (
        <EditModal
          tweet={editingTweet}
          user={user}
          onClose={() => setEditingTweet(null)}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}

function EditModal({ tweet, user, onClose, onUpdated }) {
  const [content, setContent] = useState(tweet.content);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await updateTweet(user.username, tweet._id, { content });
      onUpdated(res.data?.data || { ...tweet, content });
    } catch {
      toast.error("Failed to update tweet");
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !content.trim()}
            className="px-5 py-2 rounded-xl bg-[#ae7aff] text-black text-sm font-semibold hover:bg-[#9b63e5] disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TweetSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] overflow-hidden">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex gap-3 p-4 border-b border-[#2a2a2a] animate-pulse">
          <div className="h-10 w-10 rounded-full bg-[#2a2a2a] shrink-0" />
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
            <div className="h-3 bg-[#2a2a2a] rounded w-full" />
            <div className="h-3 bg-[#2a2a2a] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}