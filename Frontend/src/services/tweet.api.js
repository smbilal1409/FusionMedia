// src/services/tweetService.js
import api from "./api";

export const createTweet = (data) =>
  api.post("/tweet/createtweet", data);

export const getTweets = (username) =>
  api.get(`/tweet/getthetweet/${username}`);

export const updateTweet = (username, id, data) =>
  api.put(`/tweet/updatetweet/${username}/${id}`, data);

export const deleteTweet = (username, id) =>
  api.delete(`/tweet/deletetweet/${username}/${id}`);

export const getAllTweets = () =>
  api.get("/tweet/getalltweets");