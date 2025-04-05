import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfileHandler = async () => {
        console.log(input);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8080/api/v1/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center px-4">
            <section className="flex flex-col gap-6 w-full max-w-lg mx-auto my-8">
                <h1 className="font-bold text-xl text-center">Edit Profile</h1>

                {/* Profile Picture Section */}
                <div className="flex flex-wrap items-center justify-between bg-gray-100 rounded-xl p-4 gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={user?.profilePicture} alt="profile_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-bold text-sm">{user?.username}</h1>
                            <span className="text-gray-600">{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
                    <Button 
                        onClick={() => imageRef?.current.click()} 
                        className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
                    >
                        Change photo
                    </Button>
                </div>

                {/* Bio Section */}
                <div>
                    <h1 className="font-bold text-xl mb-2">Bio</h1>
                    <Textarea 
                        value={input.bio} 
                        onChange={(e) => setInput({ ...input, bio: e.target.value })} 
                        name="bio" 
                        className="focus-visible:ring-transparent w-full"
                    />
                </div>

                {/* Gender Selection */}
                <div>
                    <h1 className="font-bold mb-2">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    {loading ? (
                        <Button className="w-full bg-[#0095F6] hover:bg-[#2a8ccd] flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button 
                            onClick={editProfileHandler} 
                            className="w-full bg-[#0095F6] hover:bg-[#2a8ccd]"
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EditProfile;
