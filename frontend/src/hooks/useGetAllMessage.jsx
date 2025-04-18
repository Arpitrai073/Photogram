import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllMessage = async () => {
            if (!selectedUser?._id) return;
            try {
                const res = await axios.get(`https://photogram-f8if.onrender.com/api/v1/message/get/${selectedUser._id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setMessages({ userId: selectedUser._id, messages: res.data.messages }));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllMessage();
    }, [selectedUser]);
};

export default useGetAllMessage;
