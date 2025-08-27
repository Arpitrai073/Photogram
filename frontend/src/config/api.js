// API Configuration for different environments
const getApiBaseUrl = () => {
    // Check if we're in development or production
    if (import.meta.env.DEV) {
        return 'http://localhost:8080';
    } else {
        // For production, use your hosted backend URL
        return 'https://photogram-f8if.onrender.com';
    }
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/api/v1/user/login',
    REGISTER: '/api/v1/user/register',
    LOGOUT: '/api/v1/user/logout',
    EDIT_PROFILE: '/api/v1/user/profile/edit',
    USER_PROFILE: (userId) => `/api/v1/user/${userId}/profile`,
    SUGGESTED_USERS: '/api/v1/user/suggested',
    
    // Post endpoints
    ALL_POSTS: '/api/v1/post/all',
    ADD_POST: '/api/v1/post/addpost',
    POST_ACTION: (postId, action) => `/api/v1/post/${postId}/${action}`,
    POST_COMMENT: (postId) => `/api/v1/post/${postId}/comment`,
    DELETE_POST: (postId) => `/api/v1/post/delete/${postId}`,
    BOOKMARK_POST: (postId) => `/api/v1/post/${postId}/bookmark`,
    VOTE_POLL: '/api/v1/post/vote',
    
    // Message endpoints
    SEND_MESSAGE: (receiverId) => `/api/v1/message/send/${receiverId}`,
    GET_MESSAGES: (userId) => `/api/v1/message/get/${userId}`,
};

console.log('API Base URL:', API_BASE_URL);
