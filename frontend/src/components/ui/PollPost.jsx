import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { BarChart3, Users } from 'lucide-react';
import { useSelector } from 'react-redux';

const PollPost = ({ post, onVote }) => {
    const { user } = useSelector(store => store.auth);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(post.votes?.some(vote => vote.user === user?._id));

    const totalVotes = post.pollOptions?.reduce((sum, option) => sum + option.votes, 0) || 0;

    const handleVote = (optionId) => {
        if (hasVoted) return;
        
        setSelectedOption(optionId);
        setHasVoted(true);
        onVote(post._id, optionId);
    };

    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            {/* Post Header */}
            <div className="flex items-center mb-4">
                <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage src={post.author?.profilePicture} />
                    <AvatarFallback>{post.author?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold">{post.author?.username}</h3>
                    <p className="text-sm text-gray-500">Poll • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Poll Question */}
            <h2 className="text-lg font-medium mb-4">{post.pollQuestion}</h2>

            {/* Poll Options */}
            <div className="space-y-3 mb-4">
                {post.pollOptions?.map((option) => {
                    const percentage = getPercentage(option.votes);
                    const isVoted = option.votes?.includes(user?._id);
                    
                    return (
                        <div
                            key={option._id}
                            className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                isVoted 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : hasVoted 
                                        ? 'border-gray-200' 
                                        : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleVote(option._id)}
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
                                    <Users className="w-4 h-4 mr-1" />
                                    {option.votes?.length || 0} votes
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Poll Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {totalVotes} total votes
                </div>
                <div>
                    {hasVoted ? 'You voted' : 'Tap to vote'}
                </div>
            </div>
        </div>
    );
};

export default PollPost;
