// src/services/videoService.js
import api from "./api";

export const uploadVideo = (formData) =>
  api.post("/video/uploadvideo", formData);

export const getVideoById = (videoId) =>
  api.get(`/video/getvideo/${videoId}`);

export const updateVideoDetails = (videoId, formData) =>
  api.patch(`/video/updatevideodetails/${videoId}`, formData);

export const deleteVideo = (videoId) =>
  api.delete(`/video/deletevideo/${videoId}`);

export const getAllVideos = () =>
  api.get("/video/getallvideos");