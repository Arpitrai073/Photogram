import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createApiUrl, API_ENDPOINTS } from "@/config/api";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllMessage = async () => {
            if (!selectedUser?._id) return;
            try {
                console.log('Fetching messages for user:', selectedUser._id);
                const res = await axios.get(createApiUrl(API_ENDPOINTS.GET_MESSAGES(selectedUser._id)), {
                    withCredentials: true
                });
                console.log('Messages response:', res.data);
                if (res.data.success) {
                    dispatch(setMessages({ userId: selectedUser._id, messages: res.data.messages }));
                }
            } catch (error) {
                console.error('Error fetching messages:', error.response?.data || error.message);
            }
        };
        fetchAllMessage();
    }, [selectedUser]);
};

export default useGetAllMessage;