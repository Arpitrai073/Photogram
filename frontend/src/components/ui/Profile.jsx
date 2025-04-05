import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import CommentDialog from "./CommentDialog";

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

  // 🛠️ Fixing CommentDialog Handling
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handlePostClick = (post) => {
    console.log("Post clicked:", post); // Debugging: Check if function runs
    setSelectedPost(post);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog"); // Debugging: Ensure close event triggers
    setSelectedPost(null);
    setShowDialog(false);
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
              <span className="font-semibold">{userProfile?.posts.length}</span>{" "}
              posts
            </p>
            <p>
              <span className="font-semibold">{userProfile?.followers.length}</span>{" "}
              followers
            </p>
            <p>
              <span className="font-semibold">{userProfile?.following.length}</span>{" "}
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
          <span className="py-3 cursor-pointer">REELS</span>
          <span className="py-3 cursor-pointer">TAGS</span>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-4 pb-20">
        {displayedPost?.map((post) => (
          <div
            key={post?._id}
            className="relative group cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={post.image}
              alt="postimage"
              className="rounded-sm my-2 w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center text-white space-x-4">
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <Heart />
                  <span>{post?.likes.length}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <MessageCircle />
                  <span>{post?.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🛠️ Fixed: Comment Dialog Outside the Map */}
      {showDialog && selectedPost && (
        <CommentDialog post={selectedPost} onClose={handleCloseDialog} />
      )}
    </div>
  );
};

export default Profile;
