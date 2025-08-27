import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetRTM from '@/hooks/useGetRTM';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import MessageReactions from './ui/MessageReactions';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();

    const { user } = useSelector(store => store.auth);
    const { messages } = useSelector(store => store.chat);

    // Debug logging
    console.log('Messages component - selectedUser:', selectedUser);
    console.log('Messages component - messages:', messages);

    const selectedUserMessages = messages[selectedUser?._id] || [];  // Default to an empty array if no messages exist for that user

    console.log('Messages component - selectedUserMessages:', selectedUserMessages);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedUserMessages]); 

    const handleMessageReaction = (messageId, reactionType) => {
        // Handle message reaction - you'll implement this with your backend
        console.log('Message reaction:', messageId, reactionType);
        // You can dispatch an action to update the message reactions
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedUserMessages.map((message) => {
                const isOwnMessage = message.senderId === user?._id;
                
                return (
                    <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {!isOwnMessage && (
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={selectedUser?.profilePicture} />
                                    <AvatarFallback>{selectedUser?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                            
                            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-2 rounded-lg ${
                                        isOwnMessage
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.message}</p>
                                </div>
                                
                                {/* Message Reactions */}
                                <div className={`mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                    <MessageReactions
                                        message={message}
                                        onReaction={handleMessageReaction}
                                        userReaction={{ userId: user?._id }}
                                    />
                                </div>
                                
                                <span className="text-xs text-gray-500 mt-1">
                                    {new Date(message.createdAt).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Messages;
