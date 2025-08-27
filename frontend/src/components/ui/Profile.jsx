import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AtSign, Heart, MessageCircle, BarChart3, Image as ImageIcon, X, Share2, Bookmark, MoreHorizontal, Eye, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import CommentDialog from "./CommentDialog";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./dialog";

// Component to render individual post in the grid
const PostGridItem = ({ post, onClick }) => {
  const isPoll = post.postType === 'poll';
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const tapTimeoutRef = useRef(null);
  
  // Double tap to like functionality
  const handleTap = () => {
    console.log('Tap detected on post:', post._id); // Debug log
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    // For immediate single click response
    if (newTapCount === 1) {
      // Single tap - show post details immediately
      console.log('Single tap - opening modal'); // Debug log
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200); // Reset after 200ms
      onClick(post);
    }
    
    tapTimeoutRef.current = setTimeout(() => {
      if (newTapCount >= 2) {
        // Double tap - like the post
        console.log('Double tap - liking post'); // Debug log
        handleDoubleTap();
      }
      setTapCount(0);
    }, 300);
  };

  const handleDoubleTap = () => {
    setIsLiked(true);
    setShowHeart(true);
    
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Hide heart after animation
    setTimeout(() => setShowHeart(false), 1000);
    
    // Reset like after 2 seconds (for demo)
    setTimeout(() => setIsLiked(false), 2000);
  };
  
  return (
    <div
      className="relative group cursor-pointer overflow-hidden interactive-card hover:shadow-lg"
      onClick={handleTap}
    >
      {isPoll ? (
        // Poll Post Display - Enhanced Design
        <div className={`poll-card rounded-sm my-2 w-full aspect-square bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-gray-200 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-all duration-300 ${isClicked ? 'scale-95 shadow-lg' : 'hover:scale-[1.02]'}`}>
          {/* Background Pattern with Floating Animation */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 right-2 w-8 h-8 bg-blue-400 rounded-full floating"></div>
            <div className="absolute bottom-4 left-3 w-6 h-6 bg-purple-400 rounded-full floating floating-delay-1"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-400 rounded-full floating floating-delay-2"></div>
          </div>
          
          {/* Main Content */}
          <div className="text-center relative z-10 cursor-pointer">
            {/* Poll Icon with Enhanced Animation */}
            <div className="mb-3">
              <div className="poll-icon w-12 h-12 mx-auto gradient-bg-blue-purple rounded-full flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Poll Question */}
            <div className="mb-2">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {post.pollQuestion?.length > 25 
                  ? `${post.pollQuestion.substring(0, 25)}...` 
                  : post.pollQuestion
                }
              </p>
            </div>
            
            {/* Poll Stats */}
            <div className="flex items-center justify-center space-x-3 text-xs">
              <div className="flex items-center space-x-1 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{post.pollOptions?.length || 0} options</span>
              </div>
              <div className="flex items-center space-x-1 text-purple-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">
                  {post.pollOptions?.reduce((total, option) => total + (option.votes?.length || 0), 0) || 0} votes
                </span>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="mt-3 flex justify-center space-x-1">
              {post.pollOptions?.slice(0, 3).map((_, index) => (
                <div 
                  key={index}
                  className={`w-1 h-1 rounded-full ${
                    index === 0 ? 'bg-blue-400' : 
                    index === 1 ? 'bg-purple-400' : 'bg-pink-400'
                  }`}
                ></div>
              ))}
            </div>
            
            {/* Click indicator */}
            <div className="mt-2 text-xs text-gray-500 opacity-70">
              Click to view details
            </div>
          </div>
          
          {/* Enhanced Shimmer Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700 shimmer-effect"></div>
        </div>
      ) : (
        // Image Post Display
        <img
          src={post.image}
          alt="postimage"
          className="rounded-sm my-2 w-full aspect-square object-cover"
        />
      )}
      
      {/* Double Tap Heart Animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="heart-beat">
            <Heart className="w-20 h-20 text-red-500 fill-current" />
          </div>
        </div>
      )}
      
      {/* Enhanced Hover Overlay with Glass Effect */}
      <div className="absolute inset-0 flex items-center justify-center glass-dark opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center text-white space-x-6">
          <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span className="font-semibold">{post?.likes?.length || 0}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">{post?.comments?.length || 0}</span>
          </button>
        </div>
      </div>
      
      {/* Enhanced Post Type Badge with Glass Effect */}
      {isPoll && (
        <div className="absolute top-2 left-2">
          <div className="glass rounded-full px-3 py-1 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-gray-700">Poll</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Corner Decoration for Polls */}
      {isPoll && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-purple-500 opacity-60"></div>
      )}
    </div>
  );
};

// Modern Post Detail Modal
const PostDetailModal = ({ post, isOpen, onClose }) => {
  const { user } = useSelector(store => store.auth);
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [showHeart, setShowHeart] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    if (!isLiked) {
      setShowHeart(true);
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        text: post.caption || 'Amazing content',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-white dark:bg-gray-900 modal-slide-in">
        {/* Accessibility: Hidden title and description for screen readers */}
        <DialogTitle className="sr-only">
          {post.postType === 'poll' ? 'Poll Details' : 'Post Details'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {post.postType === 'poll' 
            ? `Poll by ${post.author?.username}: ${post.pollQuestion}`
            : `Post by ${post.author?.username}: ${post.caption || 'Image post'}`
          }
        </DialogDescription>
        
        <div className="flex h-[80vh]">
          {/* Left Side - Image/Content */}
          <div className="flex-1 flex items-center justify-center bg-black">
            {post.postType === 'poll' ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto gradient-bg-blue-purple rounded-full flex items-center justify-center shadow-lg mb-4">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.pollQuestion}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {post.pollOptions?.map((option, index) => {
                      const votes = option.votes?.length || 0;
                      const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0) || 0;
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={index} className="relative">
                          <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{option.text}</span>
                              <span className="text-sm text-purple-600 font-semibold">{percentage}%</span>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{votes} votes</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-600">
                    Total votes: {post.pollOptions?.reduce((sum, option) => sum + (option.votes?.length || 0), 0) || 0}
                  </div>
                </div>
              </div>
            ) : (
              <img 
                src={post.image} 
                alt="post" 
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
          
          {/* Right Side - Actions & Comments */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author?.profilePicture} />
                  <AvatarFallback>{post.author?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{post.author?.username}</span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Caption */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm">
                <span className="font-semibold mr-2">{post.author?.username}</span>
                {post.caption}
              </p>
            </div>
            
            {/* Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike}
                  className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                  <span className="font-semibold">{likeCount}</span>
                </button>
                
                <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-semibold">{post.comments?.length || 0}</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
                
                <button className="flex items-center space-x-2 hover:text-yellow-500 transition-colors ml-auto">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{post.shares || 0} shares</span>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold mb-3">Comments</h3>
              {post.comments?.length > 0 ? (
                <div className="space-y-3">
                  {post.comments.slice(0, 5).map((comment, index) => (
                    <div key={index} className="flex space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.author?.profilePicture} />
                        <AvatarFallback>{comment.author?.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold mr-2">{comment.author?.username}</span>
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  // Mock analytics data - you'll replace this with real data from your backend
  const mockUserStats = {
    followers: userProfile?.followers?.length || 0,
    posts: userProfile?.posts?.length || 0,
    totalLikes: userProfile?.posts?.reduce((sum, post) => sum + (post.likes?.length || 0), 0) || 0,
    totalViews: userProfile?.posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0
  };

  const mockPostStats = {
    topPosts: userProfile?.posts?.slice(0, 5) || []
  };

  // Modern Post Detail Modal State
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Profile Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center lg:items-start py-8">
        {/* Profile Image */}
        <div className="flex justify-center">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          {/* Username & Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-lg sm:text-xl font-semibold">
              {userProfile?.username}
            </span>
            {isLoggedInUserProfile ? (
              <div className="flex gap-2">
                <Link to="/account/edit">
                  <Button variant="secondary" className="h-8">
                    Edit profile
                  </Button>
                </Link>
                <Button variant="secondary" className="h-8">
                  View archive
                </Button>
                <Button variant="secondary" className="h-8">Ad tools</Button>
              </div>
            ) : isFollowing ? (
              <div className="flex gap-2">
                <Button variant="secondary" className="h-8">Unfollow</Button>
                <Button variant="secondary" className="h-8">Message</Button>
              </div>
            ) : (
              <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                Follow
              </Button>
            )}
          </div>

          {/* Stats Section */}
          <div className="flex gap-4 text-sm sm:text-base">
            <p>
              <span className="font-semibold">{userProfile?.posts?.length || 0}</span>{" "}
              posts
            </p>
            <p>
              <span className="font-semibold">{userProfile?.followers?.length || 0}</span>{" "}
              followers
            </p>
            <p>
              <span className="font-semibold">{userProfile?.following?.length || 0}</span>{" "}
              following
            </p>
          </div>

          {/* Bio Section */}
          <div className="text-sm sm:text-base">
            <span className="font-semibold">
              {userProfile?.bio || "bio here..."}
            </span>
            <Badge className="w-fit mt-1" variant="secondary">
              <AtSign /> <span className="pl-1">{userProfile?.username}</span>
            </Badge>
            <p>🤯 Welcome to my Profile</p>
            <p>🤯 Tea,code & Creativity</p>
            <p>🤯 Traveller...</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-t border-gray-200 mt-6">
        <div className="flex items-center justify-center gap-6 sm:gap-10 text-sm">
          <span
            className={`py-3 cursor-pointer ${
              activeTab === "posts" ? "font-bold border-b-2 border-black" : ""
            }`}
            onClick={() => handleTabChange("posts")}
          >
            POSTS
          </span>
          <span
            className={`py-3 cursor-pointer ${
              activeTab === "saved" ? "font-bold border-b-2 border-black" : ""
            }`}
            onClick={() => handleTabChange("saved")}
          >
            SAVED
          </span>
          {isLoggedInUserProfile && (
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "analytics" ? "font-bold border-b-2 border-black" : ""
              }`}
              onClick={() => handleTabChange("analytics")}
            >
              <BarChart3 className="inline w-4 h-4 mr-1" />
              ANALYTICS
            </span>
          )}
          <span className="py-3 cursor-pointer">REELS</span>
          <span className="py-3 cursor-pointer">TAGS</span>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "analytics" && isLoggedInUserProfile ? (
        <div className="mt-6 pb-20">
          <AnalyticsDashboard userStats={mockUserStats} postStats={mockPostStats} />
        </div>
      ) : (
        /* Posts Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-4 pb-20">
          {displayedPost?.map((post) => (
            <PostGridItem 
              key={post?._id} 
              post={post} 
              onClick={handlePostClick}
            />
          ))}
        </div>
      )}

      {/* Modern Post Detail Modal */}
      <PostDetailModal 
        post={selectedPost}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Profile;
