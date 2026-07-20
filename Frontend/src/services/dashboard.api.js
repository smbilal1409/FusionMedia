// src/services/dashboardService.js
import api from "./api";

export const getChannelVideos = () =>
  api.get("/dashboard/getChannelvideos");

export const getChannelStats = () =>
  api.get("/dashboard/getChannelstates");
