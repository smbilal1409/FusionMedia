
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useauth";
import { getUserPlaylists } from "../../services/playlist.api.js";
import CreatePlaylistModal from "../../components/Playlist/CreatePlaylistModal.jsx";

export default function PlaylistsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    getUserPlaylists(user._id)
      .then((res) => setPlaylists(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
          <p className="text-gray-400 text-sm mt-1">
            {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-full bg-[#ae7aff] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playlist
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4">
              <div className="w-full aspect-video rounded-lg bg-[#2a2a2a] mb-3" />
              <div className="h-4 bg-[#2a2a2a] rounded w-2/3 mb-2" />
              <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : playlists.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <span className="text-5xl">📋</span>
          <p className="text-white font-semibold text-lg">No playlists yet</p>
          <p className="text-gray-400 text-sm">Create your first playlist to organize videos</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-3 rounded-full bg-[#ae7aff] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] transition"
          >
            Create Playlist
          </button>
        </div>
      ) : (
        // Playlist grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.map((playlist) => {
            const firstVideo = playlist.videos?.[0];
            const thumbnail =
              typeof firstVideo === "object"
                ? (firstVideo?.Thumnil || firstVideo?.thumbnail)
                : null;
            const videoCount = playlist.videos?.length || 0;

            return (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="cursor-pointer rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] overflow-hidden hover:border-[#ae7aff] transition group"
              >
                {/* Thumbnail with stacked card effect */}
                <div className="relative w-full aspect-video bg-[#2a2a2a]">
                  {thumbnail ? (
                    <img src={thumbnail} alt={playlist.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-gray-600">
                      📋
                    </div>
                  )}
                  {/* Video count overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-end p-2">
                    <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {videoCount} video{videoCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-[#ae7aff] transition">
                    {playlist.name}
                  </p>
                  {playlist.description && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreatePlaylistModal
          onClose={() => setShowCreate(false)}
          onCreated={(newPlaylist) => setPlaylists((prev) => [newPlaylist, ...prev])}
        />
      )}
    </div>
  );
}