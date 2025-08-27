import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createApiUrl, API_ENDPOINTS } from "@/config/api";

const useGetSuggestedUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(createApiUrl(API_ENDPOINTS.SUGGESTED_USERS), { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSuggestedUsers();
    }, []);
};

export default useGetSuggestedUser;