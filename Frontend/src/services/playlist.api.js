// src/services/playlistService.js
import api from "./api";

export const createPlaylist = (data) =>
  api.post("/playlist/creatplaylist", data);

export const getUserPlaylists = (userId) =>
  api.get(`/playlist/getuserplaylistbyuserid/${userId}`);

export const getPlaylistById = (playlistId) =>
  api.get(`/playlist/getplaylistbyplaylistid/${playlistId}`);

export const addVideosToPlaylist = (playlistId, videoIds) =>
  api.patch(`/playlist/addvideostoplaylist/${playlistId}/videos/${videoIds}`);

export const removeVideoFromPlaylist = (playlistId, videoIds) =>
  api.delete(`/playlist/removevideofromplaylist/${playlistId}/videos/${videoIds}`);

export const deletePlaylist = (playlistId) =>
  api.delete(`/playlist/deleteplaylistbyid/${playlistId}`);

export const updatePlaylist = (playlistId, data) =>
  api.put(`/playlist/updateplaylistbyid/${playlistId}`, data);
