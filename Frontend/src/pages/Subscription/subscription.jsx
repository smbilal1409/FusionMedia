
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useauth.js";
import { getSubscribedChannels, toggleSubscription } from "../../services/subscription.api.js";
import toast from "react-hot-toast";

export default function Subscriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    getSubscribedChannels(user._id)
      .then((res) => setChannels(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleUnsubscribe = async (channelId) => {
    try {
      await toggleSubscription(channelId);
      setChannels((prev) => prev.filter((c) => c._id !== channelId));
    } catch {
      toast.error("Failed to unsubscribe");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-gray-400 text-sm mt-1">
          {channels.length} channel{channels.length !== 1 ? "s" : ""} you follow
        </p>
      </div>

      {loading ? (
        <ChannelSkeleton />
      ) : channels.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3 text-center">
          <span className="text-5xl">📺</span>
          <p className="text-white font-semibold text-lg">No subscriptions yet</p>
          <p className="text-gray-400 text-sm">Channels you subscribe to will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 hover:border-[#ae7aff]/40 transition"
            >
              {/* Channel info */}
              <div
                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                onClick={() => navigate(`/profile/${channel.username}`)}
              >
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#2a2a2a] shrink-0">
                  {channel.avatar ? (
                    <img src={channel.avatar} alt={channel.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#ae7aff] bg-[#2a2a2a]">
                      {channel.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate hover:text-[#ae7aff] transition">
                    {channel.fullName || channel.username}
                  </p>
                  <p className="text-gray-400 text-xs">@{channel.username}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {channel.subscriberscount || 0} subscriber{channel.subscriberscount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Unsubscribe button */}
              <button
                onClick={() => handleUnsubscribe(channel._id)}
                className="shrink-0 rounded-full border border-[#333] px-4 py-1.5 text-xs text-gray-400 hover:border-red-500/50 hover:text-red-400 transition"
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChannelSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 animate-pulse">
          <div className="h-14 w-14 rounded-full bg-[#2a2a2a] shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
            <div className="h-3 bg-[#2a2a2a] rounded w-1/4" />
          </div>
          <div className="h-8 w-24 rounded-full bg-[#2a2a2a]" />
        </div>
      ))}
    </div>
  );
}