import { Router } from "express";

import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.models.js";
import { upload } from "../middlewares/multer.middleware.js";
import { get } from "mongoose";
import {
  togglesubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/togglesubscription/:channelid").post(verifyJWT, togglesubscription);
router.route("/getuserchennelsubscribers/:channelid").get(verifyJWT, getUserChannelSubscribers);
// router.route("/getsubscribedchannel/:channelid").get(verifyJWT, getSubscribedChannels);
router.route("/getsubscribedchannel/:subscriberId").get(
    verifyJWT,
    getSubscribedChannels
);
export default router; 