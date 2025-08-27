// Utility file to help update remaining API URLs
// This file contains examples and instructions for updating the remaining components

/*
REMAINING FILES TO UPDATE:

1. EditProfile.jsx - Line 43
   Replace: 'http://localhost:8080/api/v1/user/profile/edit'
   With: createApiUrl(API_ENDPOINTS.EDIT_PROFILE)

2. useGetUserProfile.jsx - Line 13
   Replace: `http://localhost:8080/api/v1/user/${userId}/profile`
   With: createApiUrl(API_ENDPOINTS.USER_PROFILE(userId))

3. CommentDialog.jsx - Line 38
   Replace: `http://localhost:8080/api/v1/post/${selectedPost?._id}/comment`
   With: createApiUrl(API_ENDPOINTS.POST_COMMENT(selectedPost?._id))

4. CreatePost.jsx - Line 41
   Replace: 'http://localhost:8080/api/v1/post/addpost'
   With: createApiUrl(API_ENDPOINTS.ADD_POST)

5. Post.jsx - Multiple lines (43, 68, 94, 108)
   Replace all localhost URLs with appropriate API_ENDPOINTS

EXAMPLE UPDATES:

// Before:
const res = await axios.post('http://localhost:8080/api/v1/user/login', data, config);

// After:
import { createApiUrl, API_ENDPOINTS } from '@/config/api';
const res = await axios.post(createApiUrl(API_ENDPOINTS.LOGIN), data, config);

// Before:
const res = await axios.get(`http://localhost:8080/api/v1/post/${postId}/like`, config);

// After:
const res = await axios.get(createApiUrl(API_ENDPOINTS.POST_ACTION(postId, 'like')), config);
*/

export const updateInstructions = {
    filesToUpdate: [
        'EditProfile.jsx',
        'useGetUserProfile.jsx', 
        'CommentDialog.jsx',
        'CreatePost.jsx',
        'Post.jsx'
    ],
    pattern: 'http://localhost:8080',
    replacement: 'createApiUrl(API_ENDPOINTS.ENDPOINT_NAME)'
};
