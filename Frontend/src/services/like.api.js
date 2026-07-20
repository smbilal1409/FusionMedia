// src/services/likeService.js
import api from "./api";

export const toggleVideoLike = (videoId) =>
  api.post(`/like/togglevideolike/${videoId}`);

export const toggleCommentLike = (commentId) =>
  api.post(`/like/togglecommentlike/${commentId}`);

export const toggleTweetLike = (tweetId) =>
  api.post(`/like/toggletweetlike/${tweetId}`);

export const getLikedVideos = () =>
  api.get("/like/getlikedvideos");
