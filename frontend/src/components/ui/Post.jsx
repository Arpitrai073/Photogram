import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import {
  Bookmark,
  MessageCircle,
  MessageCircleCode,
  MoreHorizontal,
  Send,
  BarChart3,
} from "lucide-react";
import { Button } from "./button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast } from "sonner";
import Posts from "./Posts";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./badge";
import { createApiUrl, API_ENDPOINTS } from "@/config/api";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [hasVoted, setHasVoted] = useState(
    post.postType === 'poll' && post.pollOptions?.some(option => 
      option.votes?.includes(user?._id)
    )
  );
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
      const inputText = e.target.value;
      if (inputText.trim()) {
          setText(inputText);
      } else {
          setText("");
      }
  }

  const likeOrDislikeHandler = async () => {
      try {
          const action = liked ? 'dislike' : 'like';
          const res = await axios.get(createApiUrl(API_ENDPOINTS.POST_ACTION(post._id, action)), { withCredentials: true });
          console.log(res.data);
          if (res.data.success) {
              const updatedLikes = liked ? postLike - 1 : postLike + 1;
              setPostLike(updatedLikes);
              setLiked(!liked);

              // apne post ko update krunga
              const updatedPostData = posts.map(p =>
                  p._id === post._id ? {
                      ...p,
                      likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                  } : p
              );
              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
          }
      } catch (error) {
          console.log(error);
      }
  }

  const commentHandler = async () => {
      try {
          const res = await axios.post(createApiUrl(API_ENDPOINTS.POST_COMMENT(post._id)), { text }, {
              headers: {
                  'Content-Type': 'application/json'
              },
              withCredentials: true
          });
          console.log(res.data);
          if (res.data.success) {
              const updatedCommentData = [...comment, res.data.comment];
              setComment(updatedCommentData);

              const updatedPostData = posts.map(p =>
                  p._id === post._id ? { ...p, comments: updatedCommentData } : p
              );

              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
              setText("");
          }
      } catch (error) {
          console.log(error);
      }
  }

  const deletePostHandler = async () => {
      try {
          const res = await axios.delete(createApiUrl(API_ENDPOINTS.DELETE_POST(post?._id)), { withCredentials: true })
          if (res.data.success) {
              const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
          }
      } catch (error) {
          console.log(error);
          toast.error(error.response.data.messsage);
      }
  }

  const bookmarkHandler = async () => {
      try {
          const res = await axios.get(createApiUrl(API_ENDPOINTS.BOOKMARK_POST(post?._id)), {withCredentials:true});
          if(res.data.success){
              toast.success(res.data.message);
          }
      } catch (error) {
          console.log(error);
      }
  }

  const handlePollVote = async (optionIndex) => {
    if (hasVoted) return;

    try {
      const res = await axios.post(createApiUrl(API_ENDPOINTS.VOTE_POLL), {
        postId: post._id,
        optionIndex
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        setHasVoted(true);
        // Update the post in Redux store
        const updatedPostData = posts.map(p =>
          p._id === post._id ? res.data.post : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success('Vote recorded!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const getTotalVotes = () => {
    if (!post.pollOptions) return 0;
    return post.pollOptions.reduce((sum, option) => sum + (option.votes?.length || 0), 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  return (
      <div className='my-8 w-full max-w-sm mx-auto'>
          <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                  <Avatar>
                      <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                      <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex items-center gap-3'>
                      <h1>{post.author?.username}</h1>
                     {user?._id === post.author._id &&  <Badge variant="secondary">Author</Badge>}
                     {post.postType === 'poll' && <Badge variant="outline"><BarChart3 className="w-3 h-3 mr-1" />Poll</Badge>}
                  </div>
              </div>
              <Dialog>
                  <DialogTrigger asChild>
                      <MoreHorizontal className='cursor-pointer' />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                      {
                      post?.author?._id !== user?._id && <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                      }
                      
                      <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
                      {
                          user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                      }
                  </DialogContent>
              </Dialog>
          </div>

          {/* Post Content */}
          {post.postType === 'poll' ? (
            // Poll Content
            <div className="border border-gray-200 rounded-lg p-4 my-2">
              <h2 className="text-lg font-medium mb-4">{post.pollQuestion}</h2>
              <div className="space-y-3">
                {post.pollOptions?.map((option, index) => {
                  const votes = option.votes?.length || 0;
                  const percentage = getPercentage(votes);
                  const isVoted = option.votes?.includes(user?._id);
                  
                  return (
                    <div
                      key={index}
                      className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        isVoted 
                          ? 'border-blue-500 bg-blue-50' 
                          : hasVoted 
                            ? 'border-gray-200' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePollVote(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        {hasVoted && (
                          <span className="text-sm font-semibold text-blue-600">
                            {percentage}%
                          </span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      {hasVoted && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Vote Count */}
                      {hasVoted && (
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span>{votes} votes</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-4">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {getTotalVotes()} total votes
                </div>
                <div>
                  {hasVoted ? 'You voted' : 'Tap to vote'}
                </div>
              </div>
            </div>
          ) : (
            // Image Content
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />
          )}

          <div className='flex items-center justify-between my-2'>
              <div className='flex items-center gap-3'>
                  {
                      liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                  }

                  <MessageCircle onClick={() => {
                      dispatch(setSelectedPost(post));
                      setOpen(true);
                  }} className='cursor-pointer hover:text-gray-600' />
                  <Send className='cursor-pointer hover:text-gray-600' />
              </div>
              <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
          </div>
          <span className='font-medium block mb-2'>{postLike} likes</span>
          <p>
              <span className='font-medium mr-2'>{post.author?.username}</span>
              {post.caption}
          </p>
          {
              comment.length > 0 && (
                  <span onClick={() => {
                      dispatch(setSelectedPost(post));
                      setOpen(true);
                  }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
              )
          }
          <CommentDialog open={open} setOpen={setOpen} />
          <div className='flex items-center justify-between'>
              <input
                  type="text"
                  placeholder='Add a comment...'
                  value={text}
                  onChange={changeEventHandler}
                  className='outline-none text-sm w-full'
              />
              {
                  text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
              }

          </div>
      </div>
  )
}

export default Post