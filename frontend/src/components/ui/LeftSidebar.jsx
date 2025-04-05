import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Button } from "./button";
import { clearLikeNotifications } from "@/redux/rtnSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsPopoverOpen(true); // Open the popover
    setTimeout(() => {
      dispatch(clearLikeNotifications()); // Clear notifications AFTER popover opens
    }, 4000); // 10s delay to ensure it opens before clearing
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "https://photogram-f8if.onrender.com/api/v1/user/logout",
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      default:
        break;
    }
  };

  const fullSidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  const mobileSidebarItems = fullSidebarItems.filter((item) =>
    ["Home", "Messages", "Notifications", "Create", "Profile", "Logout"].includes(item.text)
  );

  const renderItem = (item, index, isMobile = false) => (
    <div
      key={index}
      onClick={() => sidebarHandler(item.text)}
      className={`flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 ${
        isMobile ? "justify-center" : "my-3"
      }`}
    >
      {item.icon}
      {!isMobile && <span>{item.text}</span>}

      {item.text === "Notifications" && likeNotification.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button  onClick={handleNotificationClick}
              size="icon"
              className={`rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute ${
                isMobile ? "-top-2 -right-2" : "bottom-6 left-6"
              }`}
            >
              {likeNotification.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            {likeNotification.map((notification) => (
              <div
                key={notification.userId}
                className="flex items-center gap-2 my-2"
              >
                <Avatar>
                  <AvatarImage src={notification.userDetails?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post
                </p>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );

  return (
    <>
      {/* ✅ Desktop Sidebar (Visible on lg+) */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
        <h1 className="my-8 pl-3 font-bold text-xl "style={{ fontFamily: '"Grand Hotel", cursive' }}>Photogram</h1>
        <div>
          {fullSidebarItems.map((item, index) => renderItem(item, index))}
        </div>
      </div>

      {/* ✅ Bottom Navbar for Mobile (Visible on <lg) */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-md border-t flex justify-around py-2 z-50">
        {mobileSidebarItems.map((item, index) =>
          renderItem(item, index, true)
        )}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;