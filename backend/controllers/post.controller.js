import sharp from "sharp";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId,io } from "../socket/socket.js";

export const addNewPost=async(req,res)=>{
    try {
        const {caption, postType, pollQuestion, pollOptions}=req.body;
        const image=req.file;
        const authorId=req.id;

        console.log('Received data:', { caption, postType, pollQuestion, pollOptions, hasImage: !!image });

        // Validate post type
        if (!postType || !['image', 'poll'].includes(postType)) {
            return res.status(400).json({ 
                message: "Invalid post type. Must be 'image' or 'poll'", 
                success: false 
            });
        }

        let postData = {
            caption,
            postType,
            author: authorId
        };

        // Handle image posts
        if (postType === 'image') {
            if (!image) {
                return res.status(400).json({ 
                    message: "Please provide an image for image posts", 
                    success: false 
                });
            }
            
            const optimizedImage = await sharp(image.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            
            const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            postData.image = cloudResponse.secure_url;
        }

        // Handle poll posts
        if (postType === 'poll') {
            console.log('Processing poll post with:', { pollQuestion, pollOptions, type: typeof pollOptions });
            
            if (!pollQuestion) {
                return res.status(400).json({ 
                    message: "Poll question is required", 
                    success: false 
                });
            }

            if (!pollOptions) {
                return res.status(400).json({ 
                    message: "Poll options are required", 
                    success: false 
                });
            }

            // Parse pollOptions if it's a string (from FormData)
            let parsedPollOptions = pollOptions;
            if (typeof pollOptions === 'string') {
                try {
                    parsedPollOptions = JSON.parse(pollOptions);
                    console.log('Parsed poll options:', parsedPollOptions);
                } catch (error) {
                    console.log('Error parsing poll options:', error);
                    return res.status(400).json({ 
                        message: "Invalid poll options format", 
                        success: false 
                    });
                }
            }

            // Now validate the parsed options
            if (!Array.isArray(parsedPollOptions) || parsedPollOptions.length < 2) {
                return res.status(400).json({ 
                    message: "Poll must have at least 2 options", 
                    success: false 
                });
            }

            // Validate poll options count
            if (parsedPollOptions.length > 4) {
                return res.status(400).json({ 
                    message: "Poll cannot have more than 4 options", 
                    success: false 
                });
            }

            // Check if all options have text
            const validOptions = parsedPollOptions.filter(option => 
                option && typeof option === 'string' && option.trim().length > 0
            );

            console.log('Valid options:', validOptions);

            if (validOptions.length < 2) {
                return res.status(400).json({ 
                    message: "All poll options must have text", 
                    success: false 
                });
            }

            postData.pollQuestion = pollQuestion;
            postData.pollOptions = validOptions.map(option => ({
                text: option.trim(),
                votes: []
            }));
        }

        console.log('Final post data:', postData);

        const post = await Post.create(postData);
        
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author', select:'-password'});
        
        return res.status(200).json({
            message: `${postType === 'poll' ? 'Poll' : 'Post'} created successfully`,
            post,
            success: true
        });

    } catch (error) {
        console.log('Error in addNewPost:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getUserPost=async(req,res)=>{
    try {
        const authorId=req.id;
        const posts=await Post.find({author:authorId}).sort({createdAt:-1}).populate({path:'author',select:'username, profilePicture'})
        .populate({path:'comments',sort:{createdAt:-1},populate:{path:'author',select:'username ,profilePicture'}});
    return res.status(200).json({posts,success:true});
    } catch (error) {
        console.log(error);
        
    }
}
export const likePost=async(req,res)=>{
    try {
        const likeKrneWalaUserKiId=req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }
        await post.updateOne({$addToSet:{likes:likeKrneWalaUserKiId}});
        await post.save();
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
         
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWalaUserKiId){
            // emit a notification event
            const notification = {
                type:'like',
                userId:likeKrneWalaUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: "Post liked", success: true });


    } catch (error) {
        console.log(error);
        
    }
}
export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWalaUserKiId){
            // emit a notification event
            const notification = {
                type:'dislike',
                userId:likeKrneWalaUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }



        return res.status(200).json({message:'Post disliked', success:true});
    } catch (error) {

    }
}

export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required', success:false});

        const comment = await Comment.create({
            text,
            author:commentKrneWalaUserKiId,
            post:postId
        })

        await comment.populate({
            path:'author',
            select:"username profilePicture"
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
};
export const getCommentsOfPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const comments=await Comment
        .find({post:postId}).populate(author, 'username, profilePicture');
        if (!comments) {
            return res.status(400).json({ message: "No comments found", success: false });
        }
        return res.status(200).json({ comments, success: true });
    

    } catch (error) {
        console.log(error);
        
    }
}
export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        // check if the logged-in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({message:'Unauthorized'});

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}
    export const bookmarkPost=async(req,res)=>{
        try {
            const postId=req.params.id;
            const authorId=req.id;
            const post=await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found", success: false });
            }
            const user=await
            User.findById(authorId);
            if (user.bookmarks.includes(post._id)) {

            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message: "Post removed from bookmarks", success: true });
            }
            else{
                await user.updateOne({$addToSet:{bookmarks:post._id}});
                await user.save();
                return res.status(200).json({type:'saved', message: "Post saved to bookmarks", success: true });

            }

        } catch (error) {
            console.log(error);
            
        }    
    }

export const votePoll = async (req, res) => {
    try {
        const { postId, optionIndex } = req.body;
        const userId = req.id;

        if (optionIndex === undefined || optionIndex < 0) {
            return res.status(400).json({
                message: "Valid option index is required",
                success: false
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        if (post.postType !== 'poll') {
            return res.status(400).json({
                message: "This post is not a poll",
                success: false
            });
        }

        if (optionIndex >= post.pollOptions.length) {
            return res.status(400).json({
                message: "Invalid option index",
                success: false
            });
        }

        // Check if user has already voted
        const hasVoted = post.pollOptions.some(option => 
            option.votes.includes(userId)
        );

        if (hasVoted) {
            return res.status(400).json({
                message: "You have already voted on this poll",
                success: false
            });
        }

        // Add vote to the selected option
        post.pollOptions[optionIndex].votes.push(userId);
        await post.save();

        await post.populate({path:'author', select:'-password'});

        return res.status(200).json({
            message: "Vote recorded successfully",
            post,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
