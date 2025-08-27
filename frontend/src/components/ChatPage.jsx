import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, ArrowLeft } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { addMessage, clearMessages } from '@/redux/chatSlice';
import { createApiUrl, API_ENDPOINTS } from '@/config/api';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    // Debug logging
    console.log('ChatPage render - selectedUser:', selectedUser);
    console.log('ChatPage render - suggestedUsers:', suggestedUsers);

    // Track selectedUser changes
    useEffect(() => {
        console.log('selectedUser changed to:', selectedUser);
    }, [selectedUser]);

    const handleUserClick = (suggestedUser) => {
        console.log('=== USER CLICK EVENT ===');
        console.log('User clicked:', suggestedUser);
        console.log('User ID:', suggestedUser?._id);
        console.log('User username:', suggestedUser?.username);
        
        // Dispatch the action
        dispatch(setSelectedUser(suggestedUser));
        
        // Log the current state after dispatch
        setTimeout(() => {
            console.log('State after dispatch - selectedUser should be updated');
        }, 100);
    };

    const sendMessageHandler = async (receiverId) => {
        if (!textMessage.trim()) return;

        try {
            console.log('Sending message to:', receiverId, 'Message:', textMessage);
            const res = await axios.post(
                createApiUrl(API_ENDPOINTS.SEND_MESSAGE(receiverId)),
                { textMessage: textMessage },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log('Send message response:', res.data);
            if (res.data.success) {
                dispatch(addMessage({ userId: receiverId, message: res.data.newMessage }));
                setTextMessage("");
            }
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        // Only clear selectedUser when component unmounts, not on every render
        return () => {
            // Only clear selectedUser on unmount, not on every render
            dispatch(setSelectedUser(null));
        };
    }, [dispatch]); // Remove selectedUser from dependency array

    // Separate useEffect to handle message clearing when selectedUser changes
    useEffect(() => {
        // Clear messages for previous user when selectedUser changes
        return () => {
            if (selectedUser?._id) {
                dispatch(clearMessages(selectedUser._id));
            }
        };
    }, [selectedUser?._id, dispatch]);

    return (
        <div className="flex h-screen w-full">
            {/* Debug info - remove this later */}
            {selectedUser && (
                <div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-50">
                    Selected: {selectedUser.username} (ID: {selectedUser._id})
                </div>
            )}
            
            {/* Debug test button - remove this later */}
            <div className="fixed top-0 right-0 bg-blue-500 text-white p-2 z-50">
                <button 
                    onClick={() => {
                        if (suggestedUsers.length > 0) {
                            console.log('Test button clicked - setting first user as selected');
                            dispatch(setSelectedUser(suggestedUsers[0]));
                        }
                    }}
                    className="bg-green-500 px-2 py-1 rounded text-xs"
                >
                    Test: Select First User
                </button>
            </div>

            {/* Left Sidebar */}
            <aside className="hidden lg:flex w-[16%] bg-gray-100 border-r border-gray-300 p-4" />

            {/* User List */}
            <section className={`bg-white border-r border-gray-300 transition-all duration-300
                ${selectedUser ? 'hidden lg:flex lg:w-[25%]' : 'w-full lg:w-[25%]'} flex flex-col`}>
                <h1 className="font-bold p-4 text-xl">{user?.username}</h1>
                <hr className="border-gray-300" />
                <div className="overflow-y-auto h-full">
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div key={suggestedUser?._id}
                                    onClick={() => handleUserClick(suggestedUser)}
                                    className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer transition rounded-lg border-2 border-transparent hover:border-blue-300"
                                    style={{ 
                                        backgroundColor: selectedUser?._id === suggestedUser?._id ? '#e3f2fd' : 'transparent',
                                        borderColor: selectedUser?._id === suggestedUser?._id ? '#2196f3' : 'transparent'
                                    }}>
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{suggestedUser?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>

            {/* Chat Section */}
            <section className={`flex-1 flex flex-col h-screen 
                ${selectedUser ? 'flex' : 'hidden lg:flex'}`}>
                {
                    selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                                <button onClick={() => dispatch(setSelectedUser(null))} className="sm:hidden p-2">
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <span className="font-medium">{selectedUser?.username}</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <Messages selectedUser={selectedUser} />

                            {/* Input */}
                            <div className="flex items-center p-4 border-t border-gray-300 bg-white sticky bottom-0 lg:mb-0 mb-14">
                                <Input
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler(selectedUser?._id)}
                                    type="text"
                                    className="flex-1 mr-2 focus-visible:ring-transparent"
                                    placeholder="Message..."
                                />
                                <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center mx-auto w-full">
                            <MessageCircleCode className="w-32 h-32 my-4" />
                            <h1 className="font-medium">Your messages</h1>
                            <span>Send a message to start a chat.</span>
                        </div>
                    )
                }
            </section>
        </div>
    );
};

export default ChatPage;
