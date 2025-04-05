import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-12">
      {/* ✅ Fixed "Photogram" Title (Hidden on Large Screens) */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md py-3 text-center text-lg font-bold lg:hidden z-10"style={{ fontFamily: '"Grand Hotel", cursive' }}>
        Photogram
      </div>

      {/* ✅ Welcome Message (Shown Once at the Top) */}
      {user && (
        <h1 className="text-xl sm:text-2xl font-semibold my-auto text-center">
          Welcome, {user.username}! 👋
        </h1>
      )}

      {/* ✅ Responsive Post List */}
      <div className="flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p className="text-center text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
