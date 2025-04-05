import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SuggestedUsers from "./ui/SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden md:block w-full max-w-sm my-10 pr-10 lg:pr-32">
      <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-gray-200 bg-white">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="profile_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-xs">{user?.bio || "Bio here..."}</span>
        </div>
      </div>

      {/* Suggested Users Section */}
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
