// src/components/Playlist/AddToPlaylistModal.jsx
// Shows on a video — lets user add/remove video from their playlists.
// Usage: <AddToPlaylistModal videoId={video._id} onClose={() => setShow(false)} />

import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useauth.js";
import {
  getUserPlaylists,
  addVideosToPlaylist,
  removeVideoFromPlaylist,
} from "../../services/playlist.api.js";
import CreatePlaylistModal from "./CreatePlaylistModal.jsx";

export default function AddToPlaylistModal({ videoId, onClose }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // playlistId currently being toggled
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    getUserPlaylists(user._id)
      .then((res) => setPlaylists(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const isVideoInPlaylist = (playlist) =>
    playlist.videos?.some((v) => (typeof v === "string" ? v === videoId : v._id === videoId));

  const handleToggle = async (playlist) => {
    setUpdating(playlist._id);
    const alreadyIn = isVideoInPlaylist(playlist);
    try {
      if (alreadyIn) {
        await removeVideoFromPlaylist(playlist._id, videoId);
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id
              ? { ...p, videos: p.videos.filter((v) => (typeof v === "string" ? v !== videoId : v._id !== videoId)) }
              : p
          )
        );
      } else {
        await addVideosToPlaylist(playlist._id, videoId);
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id ? { ...p, videos: [...(p.videos || []), videoId] } : p
          )
        );
      }
    } catch {
      alert("Failed to update playlist");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold mb-4">Save to playlist</h3>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-[#2a2a2a] animate-pulse" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">
            You don't have any playlists yet
          </p>
        ) : (
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {playlists.map((playlist) => {
              const checked = isVideoInPlaylist(playlist);
              return (
                <button
                  key={playlist._id}
                  onClick={() => handleToggle(playlist)}
                  disabled={updating === playlist._id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#2a2a2a] transition text-left disabled:opacity-50"
                >
                  <div
                    className={`h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition
                      ${checked ? "bg-[#ae7aff] border-[#ae7aff]" : "border-gray-500"}`}
                  >
                    {checked && (
                      <svg className="h-3 w-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white text-sm truncate">{playlist.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Create new playlist */}
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center gap-2 mt-3 pt-3 border-t border-[#2a2a2a] text-[#ae7aff] text-sm font-medium hover:underline"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create new playlist
        </button>

        <button
          onClick={onClose}
          className="w-full mt-4 rounded-xl bg-[#2a2a2a] py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition"
        >
          Done
        </button>
      </div>

      {showCreate && (
        <CreatePlaylistModal
          onClose={() => setShowCreate(false)}
          onCreated={(newPlaylist) => {
            setPlaylists((prev) => [...prev, newPlaylist]);
          }}
        />
      )}
    </div>
  );
}