// src/components/Playlist/CreatePlaylistModal.jsx
// A reusable modal — call it from Profile page, Video page, or anywhere.
// Usage:
//   const [showCreate, setShowCreate] = useState(false);
//   <button onClick={() => setShowCreate(true)}>New Playlist</button>
//   {showCreate && <CreatePlaylistModal onClose={() => setShowCreate(false)} onCreated={(pl) => ...} />}

import { useState } from "react";
import { createPlaylist } from "../../services/playlist.api.js";

export default function CreatePlaylistModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Playlist name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await createPlaylist({ name, description });
      onCreated?.(res.data?.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-[#2a2a2a] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold text-lg mb-4">Create New Playlist</h3>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">Name*</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Watch Later, Favorites"
              autoFocus
              className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this playlist about?"
              rows={3}
              className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#ae7aff] text-black text-sm font-semibold hover:bg-[#9b63e5] disabled:opacity-50 transition"
          >
            {saving ? "Creating..." : "Create Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
}