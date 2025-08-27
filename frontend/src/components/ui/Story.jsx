import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useSelector } from 'react-redux';
import { Circle, Plus } from 'lucide-react';

const Story = ({ stories, onStoryClick }) => {
    const { user } = useSelector(store => store.auth);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const isStoryExpired = (storyTime) => {
        const storyDate = new Date(storyTime);
        const expiryTime = storyDate.getTime() + (24 * 60 * 60 * 1000); // 24 hours
        return currentTime > expiryTime;
    };

    const activeStories = stories?.filter(story => !isStoryExpired(story.createdAt)) || [];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-8 shadow-sm">
            <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto story-container pb-2">
                {/* Add Story Button */}
                <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0">
                    <div className="relative group">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-gray-300 group-hover:border-blue-400 transition-colors">
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback className="text-base sm:text-lg lg:text-xl font-semibold">{user?.username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 sm:p-1.5 lg:p-2 shadow-lg">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                    </div>
                    <span className="text-xs sm:text-xs lg:text-sm text-gray-600 font-medium">Add Story</span>
                </div>

                {/* Story Circles */}
                {activeStories.map((story) => (
                    <div 
                        key={story._id} 
                        className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0 group"
                        onClick={() => onStoryClick(story)}
                    >
                        <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full story-gradient p-0.5 group-hover:story-gradient-hover group-hover:scale-105 transition-all duration-200">
                                <Avatar className="w-full h-full border-2 border-white shadow-sm">
                                    <AvatarImage src={story.author.profilePicture} />
                                    <AvatarFallback className="text-base sm:text-lg lg:text-xl font-semibold">{story.author.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            {/* Progress Ring - Mobile */}
                            <svg className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90 lg:hidden">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="30"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="30"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-blue-500 progress-ring"
                                    strokeDasharray={`${2 * Math.PI * 30}`}
                                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - story.progress)}`}
                                />
                            </svg>
                            {/* Progress Ring - Desktop */}
                            <svg className="absolute inset-0 w-24 h-24 transform -rotate-90 hidden lg:block">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="46"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="46"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-blue-500 progress-ring"
                                    strokeDasharray={`${2 * Math.PI * 46}`}
                                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - story.progress)}`}
                                />
                            </svg>
                        </div>
                        <span className="text-xs sm:text-xs lg:text-sm text-gray-700 font-medium truncate max-w-16 sm:max-w-20 lg:max-w-24 text-center">
                            {story.author.username}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Story;
