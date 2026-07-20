// src/services/subscriptionService.js
import api from "./api";

export const toggleSubscription = (channelId) =>
  api.post(`/subscription/togglesubscription/${channelId}`);

export const getChannelSubscribers = (channelId) =>
  api.get(`/subscription/getuserchennelsubscribers/${channelId}`);

export const getSubscribedChannels = (channelId) =>
  api.get(`/subscription/getsubscribedchannel/${channelId}`);
