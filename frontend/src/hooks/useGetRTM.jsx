import { addMessage } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            const otherUserId = newMessage.senderId === user._id ? newMessage.receiverId : newMessage.senderId;
            dispatch(addMessage({ userId: otherUserId, message: newMessage }));
        });

        return () => {
            socket?.off('newMessage');
        };
    }, [socket, dispatch, user]);
};

export default useGetRTM;
