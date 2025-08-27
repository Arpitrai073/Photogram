import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createApiUrl, API_ENDPOINTS } from "@/config/api";

const useGetAllPost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(createApiUrl(API_ENDPOINTS.ALL_POSTS), { withCredentials: true });
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllPost();
    }, []);
};

export default useGetAllPost;
