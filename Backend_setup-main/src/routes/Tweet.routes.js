import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { createTweets,getthetweets,updatethetweets,deletetweets,getalltweets } from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
console.log("tweets.routes.js loaded");

router.get("/test", (req, res) => {
    res.send("Tweet Route Working");
});

router.route("/createtweet").post(verifyJWT,createTweets);
router.route("/getthetweet/:username").get(verifyJWT,getthetweets);
router.route("/updatetweet/:username/:id").put(verifyJWT,updatethetweets);
router.route("/deletetweet/:username/:id").delete(verifyJWT,deletetweets);
router.route("/getalltweets").get(verifyJWT, getalltweets);
export default router;