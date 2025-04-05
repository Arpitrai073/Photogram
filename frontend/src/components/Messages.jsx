import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetRTM from '@/hooks/useGetRTM';
import useGetAllMessage from '@/hooks/useGetAllMessage';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();

    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center mb-4'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">View profile</Button>
                    </Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))
                }

                {/* This is the invisible ref element that we'll scroll to */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Messages;
