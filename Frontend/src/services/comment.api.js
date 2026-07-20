// src/services/commentService.js
import api from "./api";

export const addComment = (videoId, data) =>
  api.post(`/comment/addcomment/${videoId}`, data);

export const updateComment = (commentId, data) =>
  api.put(`/comment/updatecomment/${commentId}`, data);

export const deleteComment = (commentId) =>
  api.delete(`/comment/deletecomment/${commentId}`);
