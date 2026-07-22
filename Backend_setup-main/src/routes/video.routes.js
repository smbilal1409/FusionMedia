import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { uploadvideo,getvideobyid,updatevideodetails ,deletevideo,getallvideos} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
console.log("video.routes.js loaded");
router.route("/uploadvideo").post(verifyJWT,
    upload.fields([
        {
            name: "videofile",
            maxCount: 1

        },
        {
            name: "Thumnil",
            maxCount: 1

        }

    ]),
    uploadvideo
)
router.route("/getvideo/:videoid").get(verifyJWT,getvideobyid);
router.route("/updatevideodetails/:videoid").patch(verifyJWT,upload.single("Thumnil"),updatevideodetails);
router.route("/deletevideo/:videoid").delete(verifyJWT,deletevideo);
router.route("/getallvideos").get(verifyJWT, getallvideos);

export default router;