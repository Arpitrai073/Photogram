//import { setUserProfile } from "@/redux/authSlice";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createApiUrl, API_ENDPOINTS } from "@/config/api";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(createApiUrl(API_ENDPOINTS.USER_PROFILE(userId)), { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId]);
};

export default useGetUserProfile;