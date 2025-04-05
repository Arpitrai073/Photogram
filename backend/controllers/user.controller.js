import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import getDataUri from "../utils/datauri.js";
export const register = async (req, res) => {
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(401).json({message:"All fields are required",
                success:false,
            });
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(401).json({message:"User already exists",
                success:false,
            });
        }


        const hashedPassword=await bcrypt.hash(password,10);



        await User.create({username,
            email,
            password:hashedPassword});
            return res.status(201).json({message:"User registered successfully",
                success:true
            });
    }
    catch(err){
        return res.status(500).json({message:err.message,
            success:false
        });
    }
}

export const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(401).json({message:"All fields are required",
                success:false,
            });
        }
        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"User does not exist",
                success:false,
            });
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message:"Invalid credentials",
                success:false,
            });
        }
       
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "24h" });
const populatedPosts=await Promise.all(user.posts.map(async(postId)=>{
    const post=await Post.findById(postId);
    if(post.author.equals(user._id)){
        return post;
    }
    return null;
}
));


user={
    _id:user._id,
    username:user.username,
    email:user.email,
    profilePicture:user.profilePicture,
    bio:user.bio,
    followers:user.followers,
    following:user.following,
    posts:populatedPosts
}
return res.cookie("token", token, { httpOnly: true,sameSite:'strict',maxAge:1*24*60*60*1000 }).json({message:`Welcome ${user.username}`,

    success:true,
    user
});
       
    }
    catch(err){
        return res.status(500).json({message:err.message,
            success:false
        });
    }
};
export const logout = async (req, res) => {
    try{
        return res.cookie("token","",{maxAge:0}).json({message:"Logged out successfully",
            success:true
        });
    }
    catch(err){
        return res.status(500).json({message:err.message,
            success:false
        });
    }
};
export const getPofile = async (req, res) => {
    try{
        const userId=req.params.id;
         let user=await
         User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks');
         return res.status(200).json({user,
            success:true});
    }
    catch(err){
        return res.status(500).json({message:err.message,
            success:false
        });
    }
};


export const editProfile = async (req, res) => {
   try {
    const userId=req.id;
    const {
        bio,gender
    }=req.body;
    const profilePicture=req.file;
    let cloudResponse;
    if(profilePicture){
       const fileuri=getDataUri(profilePicture);
      cloudResponse= await cloudinary.uploader.upload(fileuri);
       
    }
    const user=await User.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User does not exist", success: false });
    }
    if (bio) {
        user.bio = bio;
    }
    if (gender) {
        user.gender=gender;
    }
    if (profilePicture) {
        user.profilePicture = cloudResponse.secure_url;
    }
    await user.save();
    return res.status(200).json({ message:'Profile Updated', success: true, user });

   } catch (error) {
    console.log(error);
   }};

   export const getSuggestUsers=async(req,res)=>{
       try{
           const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password");
          if (!suggestedUsers) {
              return res.status(400).json({message:"No users found",
             
          })
          };
            return res.status(200).json({
                success:true,
                users:suggestedUsers
            });
       }
         catch(err){
          console.log(err);
         
         }
    };
    export const followOrUnfollow=async(req,res)=>{
        try {
            const followKrneWala=req.id;
            const jiskoFollowKrunga=req.params.id;
            if (followKrneWala===jiskoFollowKrunga) {
                return res.status(400).json({message:"You can't follow yourself",
                success:false
            });
            }
            const user=await User.findById(followKrneWala);
            const targetUser=await User.findById(jiskoFollowKrunga);
            if (!user || !targetUser) {
                return res.status(400).json({message:"User not found",
                success:false
            });
            }
            const isFollowing=user.following.includes(jiskoFollowKrunga);
            if(isFollowing){
                await Promise.all([
                    User.updateOne({_id:followKrneWala},{$pull:{following:jiskoFollowKrunga}}),
                    User.updateOne({_id:jiskoFollowKrunga},{$pull:{followers:followKrneWala}}),
                ])
                return res.status(200).json({message:"Unfollowed successfully",
                success:true
            });
            }
            else{
                await Promise.all([
                    User.updateOne({_id:followKrneWala},{$push:{following:jiskoFollowKrunga}}),
                    User.updateOne({_id:jiskoFollowKrunga},{$push:{followers:followKrneWala}}),
                ])
                return res.status(200).json({message:"Followed successfully",
                success:true
            });

            }
        } catch (error) {
            console.log(error);
        }
    }
         