// src/pages/Video/UploadVideo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../../services/video.api.js";

export default function UploadVideo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleVideo = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select a video file");
    if (!thumbnail) return alert("Please select a thumbnail");

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("videofile", videoFile);
      formData.append("Thumnil", thumbnail); // matches your backend field name

      // Simulate progress (real progress needs axios onUploadProgress)
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p));
      }, 300);

      await uploadVideo(formData);
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      alert("Error: " + msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Video file drop zone */}
        <div
          className="relative flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-[#333] bg-[#1e1e1e] cursor-pointer hover:border-[#ae7aff] transition group"
          onClick={() => document.getElementById("videoInput").click()}
        >
          {videoPreview ? (
            <video src={videoPreview} className="h-full w-full rounded-xl object-contain" controls />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-[#ae7aff] transition">
              <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <p className="text-sm font-medium">Click to select video</p>
              <p className="text-xs">MP4, WebM, MOV supported</p>
            </div>
          )}
          <input id="videoInput" type="file" accept="video/*" className="hidden" onChange={handleVideo} />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Title*</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Give your video a title"
            className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell viewers about your video"
            rows={4}
            className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm resize-none"
          />
        </div>

        {/* Thumbnail */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Thumbnail*</label>
          <div
            className="flex items-center gap-4 rounded-xl border border-dashed border-[#333] bg-[#1e1e1e] p-4 cursor-pointer hover:border-[#ae7aff] transition"
            onClick={() => document.getElementById("thumbInput").click()}
          >
            {thumbPreview ? (
              <img src={thumbPreview} alt="Thumbnail" className="h-24 w-40 rounded-lg object-cover" />
            ) : (
              <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-[#2a2a2a] text-gray-500 text-xs text-center px-2">
                Click to upload thumbnail
              </div>
            )}
            <div className="text-gray-400 text-sm">
              <p className="font-medium">Upload thumbnail</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG recommended (16:9)</p>
            </div>
            <input id="thumbInput" type="file" accept="image/*" className="hidden" onChange={handleThumb} />
          </div>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#2a2a2a]">
              <div
                className="h-2 rounded-full bg-[#ae7aff] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl border border-[#333] py-3 text-sm text-gray-400 hover:text-white hover:border-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 rounded-xl bg-[#ae7aff] py-3 text-sm font-semibold text-black hover:bg-[#9b63e5] disabled:opacity-50 transition"
          >
            {uploading ? `Uploading ${progress}%...` : "Upload Video"}
          </button>
        </div>
      </form>
    </div>
  );
}