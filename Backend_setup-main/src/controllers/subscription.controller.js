import asynchandlerfunction from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Video } from "../models/videos.models.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import { Subscription } from "../models/subscription.model.js";
const togglesubscription=asynchandlerfunction(async(req,res)=>{
const{channelid}=req.params;
const checksubscription=await Subscription.findOne({
    subscriber:req.user._id,
    channel:channelid
})
if(checksubscription){
    await Subscription.findByIdAndDelete(checksubscription._id);
    return res
    .status(200)
    .json(new ApiResponse(200, null, "User unsubscribed successfully"));
}
else{
    const newsubscribtion=await Subscription.create({
        subscriber:req.user._id,
    channel:channelid
    })
    return res.status(200).json(new ApiResponse(200,newsubscribtion,"user can subscribe now"));
}
})
const getUserChannelSubscribers = asynchandlerfunction(async (req, res) => {
    const {channelid} = req.params;
    const subscriberslist=await Subscription.find({
        channel:channelid
    }  
).populate("subscriber","username fullname email")
return res.status(200)
.json(new ApiResponse(200,subscriberslist,"subscriber list successfully sended"))
})

const getSubscribedChannels = asynchandlerfunction(async (req, res) => {
    const { subscriberId } = req.params;

    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    }).populate(
        "channel",
        "username fullname email avatar coverimage"
    );

    const channels = subscriptions.map((sub) => sub.channel);

    return res.status(200).json(
        new ApiResponse(
            200,
            channels,
            "Subscribed channels fetched successfully"
        )
    );
});
export {togglesubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}