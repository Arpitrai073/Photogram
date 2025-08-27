import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "@/services/socketService";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector(store => store.chat);
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            try {
                // Ensure we have valid data
                if (!newMessage || !newMessage.senderId || !newMessage.receiverId) {
                    console.warn('Invalid message received:', newMessage);
                    return;
                }

                const userId = newMessage.senderId === selectedUser?._id ? newMessage.senderId : newMessage.receiverId;

                // Get current messages for this user
                const currentMessages = messages[userId] || [];

                // Create a new messages object with the updated conversation
                const updatedMessages = {
                    ...messages,
                    [userId]: [...currentMessages, newMessage]
                };

                // Update the entire messages state for this user
                dispatch(setMessages({ userId, messages: updatedMessages[userId] }));
            } catch (error) {
                console.error('Error handling new message:', error);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [messages, dispatch, selectedUser]);
};

export default useGetRTM;
