// src/components/Comments/CommentSection.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useauth";
import { addComment, updateComment, deleteComment } from "../../services/comment.api.js";
import { toggleCommentLike } from "../../services/like.api.js";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  return `${mins}m ago`;
}

export default function CommentSection({ videoId, comments: initialComments = [] }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(videoId, { content: newComment });
      const posted = res.data?.data;
      // attach current user so avatar/name shows immediately
      setComments([{ ...posted, owner: user }, ...comments]);
      setNewComment("");
    } catch {
      alert("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const res = await updateComment(commentId, { content: editText });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: editText } : c))
      );
      setEditingId(null);
    } catch {
      alert("Failed to update comment");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-white font-semibold text-lg mb-4">
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h3>

      {/* Compose */}
      <div className="flex gap-3 mb-6">
        <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a]">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#ae7aff]">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-[#333] pb-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ae7aff] transition"
          />
          {newComment && (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewComment("")}
                className="px-3 py-1 text-xs text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting}
                className="px-4 py-1 rounded-full bg-[#ae7aff] text-black text-xs font-semibold hover:bg-[#9b63e5] disabled:opacity-50 transition"
              >
                {posting ? "Posting..." : "Comment"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-5">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-[#2a2a2a]">
              {comment.owner?.avatar ? (
                <img src={comment.owner.avatar} alt={comment.owner.username} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#ae7aff]">
                  {comment.owner?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">
                  @{comment.owner?.username || "unknown"}
                </span>
                <span className="text-gray-500 text-xs">{timeAgo(comment.createdAt)}</span>
              </div>

              {editingId === comment._id ? (
                <div className="mt-1 flex flex-col gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-transparent border-b border-[#ae7aff] pb-1 text-sm text-white focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEdit(comment._id)}
                      className="text-xs text-[#ae7aff] font-semibold hover:underline"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm mt-0.5">{comment.content}</p>
              )}

              {/* Actions */}
              {user?.username === comment.owner?.username && editingId !== comment._id && (
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => { setEditingId(comment._id); setEditText(comment.content); }}
                    className="text-xs text-gray-500 hover:text-[#ae7aff] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-xs text-gray-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}