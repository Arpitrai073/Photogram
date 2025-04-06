import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, ArrowLeft } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { addMessage } from '@/redux/chatSlice';


const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers } = useSelector(store => store.chat);
    const dispatch = useDispatch();


    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`https://photogram-f8if.onrender.com/api/v1/message/send/${receiverId}`, {message: textMessage }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(addMessage({ userId: receiverId, message: res.data.newMessage }));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, []);

    return (
        <div className="flex h-screen w-full">
            {/* Left Sidebar (16% width, only on desktop) */}
            <aside className="hidden lg:flex w-[16%] bg-gray-100 border-r border-gray-300 p-4">
                {/* <h1 className="font-bold text-xl">Left Sidebar</h1> */}
            </aside>

            {/* User List (25% width) */}
            <section className={`bg-white border-r border-gray-300 transition-all duration-300
                ${selectedUser ? 'hidden sm:flex sm:w-[25%]' : 'w-full sm:w-[25%]'} flex flex-col`}>
                <h1 className="font-bold p-4 text-xl">{user?.username}</h1>
                <hr className="border-gray-300" />
                <div className="overflow-y-auto h-full">
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div key={suggestedUser?._id}
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                    className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer transition rounded-lg">
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

            {/* Chat Section (flex-1) */}
            <section className={`flex-1 flex flex-col h-screen 
                ${selectedUser ? 'flex' : 'hidden sm:flex'}`}>
                {
                    selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                                {/* Back button for Mobile */}
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
                            <div className="flex items-center p-4 border-t border-gray-300 bg-white sticky bottom-0 lg:mb-0 mb-14">
    <Input
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
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
    );console.log("Request body:", req.body);
}

export default ChatPage;
