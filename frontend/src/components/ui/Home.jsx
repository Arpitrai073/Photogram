import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './feed'
import RightSidebar from '../RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUser'
import Story from './Story'

function Home() {

  useGetAllPost();
  useGetSuggestedUsers();

  // Mock stories data - you'll replace this with real data from your backend
  const mockStories = [
    {
      _id: '1',
      author: {
        _id: 'user1',
        username: 'john_doe',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      progress: 0.8
    },
    {
      _id: '2',
      author: {
        _id: 'user2',
        username: 'jane_smith',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      progress: 0.6
    },
    {
      _id: '3',
      author: {
        _id: 'user3',
        username: 'mike_wilson',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      progress: 0.4
    }
  ];

  const handleStoryClick = (story) => {
    // Handle story click - you can implement story viewer here
    console.log('Story clicked:', story);
    // You can open a modal or navigate to story viewer
  };

  return (
    <div className='flex min-h-screen'>
        <div className='flex-grow lg:pr-4 pb-20 lg:pb-0'>
          {/* Stories Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
            <Story stories={mockStories} onStoryClick={handleStoryClick} />
          </div>
          
          <Feed/>
          <Outlet/>
        </div>
        <RightSidebar/>
    </div>
  )
}

export default Home