import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { Button } from './button';

const reactions = [
    { emoji: '❤️', name: 'heart' },
    { emoji: '👍', name: 'thumbsup' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '😮', name: 'wow' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😠', name: 'angry' },
];

const MessageReactions = ({ message, onReaction, userReaction }) => {
    const [showReactions, setShowReactions] = useState(false);

    const handleReaction = (reactionName) => {
        onReaction(message._id, reactionName);
        setShowReactions(false);
    };

    const getReactionCount = (reactionName) => {
        return message.reactions?.filter(r => r.type === reactionName).length || 0;
    };

    const hasUserReaction = (reactionName) => {
        return message.reactions?.some(r => r.user === userReaction?.userId && r.type === reactionName);
    };

    return (
        <div className="relative">
            {/* Reaction Button */}
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => setShowReactions(!showReactions)}
            >
                <Smile className="h-4 w-4" />
            </Button>

            {/* Reactions Popup */}
            {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                    <div className="flex space-x-1">
                        {reactions.map((reaction) => (
                            <button
                                key={reaction.name}
                                onClick={() => handleReaction(reaction.name)}
                                className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                                    hasUserReaction(reaction.name) ? 'bg-blue-100' : ''
                                }`}
                                title={reaction.name}
                            >
                                <span className="text-lg">{reaction.emoji}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Display Reactions */}
            {message.reactions && message.reactions.length > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                    {reactions.map((reaction) => {
                        const count = getReactionCount(reaction.name);
                        if (count === 0) return null;
                        
                        return (
                            <div
                                key={reaction.name}
                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                                    hasUserReaction(reaction.name)
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                <span>{reaction.emoji}</span>
                                <span>{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MessageReactions;
