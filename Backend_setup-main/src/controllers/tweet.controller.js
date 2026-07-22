import asynchandlerfunction from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Tweet } from "../models/tweets.models.js";
import { Like } from "../models/likes.model.js";
const createTweets=asynchandlerfunction(async(req,res)=>{
    const{content}=req.body;
    if(!content){
        throw new ApiError;
    }
    const tweet=await Tweet.create({
content:content,
owner:req.user._id
    })
    if(!tweet){
        throw new ApiError(404,"tweet is not found");
    }
    const createdTweet = await Tweet.findById(tweet._id).populate(
        "owner",
        "username avatar fullname"
    );
    
    return res.status(201).json(new ApiResponse(201, createdTweet, "Tweet successfully created"));
})
const getthetweets=asynchandlerfunction(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username:username.toLowerCase()});
    if(!user){
        throw new ApiError(404,"User is not found")
    }
    const tweets=await Tweet.find({owner:user._id}).
    sort({createdAt:-1}).
    populate("owner","username avatar fullname");
    return res.status(200).json(new ApiResponse(200,tweets,"tweets succesfully snded and shown"));
})
const updatethetweets=asynchandlerfunction(async(req,res)=>{
    const{username,id}=req.params
    const{content}=req.body;
    if(!content){
        throw new ApiError(402,"content is not found")
    }
    const user=await User.findOne({username:username.toLowerCase()})
    if(!user){
        throw new ApiError(403,"the user is unable to find")
    }
    const tweet=await Tweet.findOne({_id:id,owner:user._id});
    if(!tweet){
        throw new ApiError(403,"Unable to find the tweet")
    }
    tweet.content=content;
    await tweet.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200,tweet,"tweet updated successfully"));
})
const deletetweets=asynchandlerfunction(async(req,res)=>{
    const{username,id}=req.params;
    const user=await User.findOne({username:username.toLowerCase()})
    if(!user){
        throw new ApiError(405,"user is unable to find")
    }
    const tweet=await Tweet.findOne({owner:user._id,_id:id})
    if(!tweet){
        throw new ApiError(402,"the tweet is not found")
    }
    await tweet.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    );

})

const getalltweets = asynchandlerfunction(async (req, res) => {
    const userId = req.user._id;
 
    const tweets = await Tweet.find()
        .populate("owner", "username fullName avatar")
        .sort({ createdAt: -1 });
 
    // ✅ For each tweet, check if current user has liked it
    const tweetsWithLikeStatus = await Promise.all(
        tweets.map(async (tweet) => {
            const isLiked = await Like.findOne({
                tweet: tweet._id,
                likedby: userId
            });
            return {
                ...tweet.toObject(),
                isLiked: !!isLiked,
                likesCount: await Like.countDocuments({ tweet: tweet._id })
            };
        })
    );
 
    return res.status(200)
        .json(new ApiResponse(200, tweetsWithLikeStatus, "All tweets fetched successfully"));
});
 
export{createTweets
      ,getthetweets
      ,updatethetweets,
       deletetweets,
       getalltweets}