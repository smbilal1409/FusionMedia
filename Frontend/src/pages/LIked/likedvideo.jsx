// src/pages/Liked/LikedVideos.jsx
import { useState, useEffect } from "react";
import { getLikedVideos } from "../../services/like.api.js";
import VideoCard from "../../components/videocard/videocard.jsx";

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedVideos()
      .then((res) => setVideos(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Liked Videos</h1>
        <p className="text-gray-400 text-sm mt-1">{videos.length} video{videos.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <GridSkeleton />
      ) : videos.length === 0 ? (
        <Empty icon="❤️" text="No liked videos yet" sub="Videos you like will appear here" />
      ) : (
        // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        //   {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        // </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {videos.map((v) => (
    <VideoCard
      key={v.video._id}
      video={v.video}
    />
  ))}
</div>
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col gap-2">
          <div className="w-full aspect-video rounded-xl bg-[#2a2a2a]" />
          <div className="h-3 bg-[#2a2a2a] rounded w-3/4" />
          <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function Empty({ icon, text, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <span className="text-5xl">{icon}</span>
      <p className="text-white font-semibold text-lg">{text}</p>
      <p className="text-gray-400 text-sm">{sub}</p>
    </div>
  );
}