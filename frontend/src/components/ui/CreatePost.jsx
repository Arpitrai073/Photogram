import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './dialog'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Textarea } from './textarea'
import { Button } from './button'
import { Input } from './input'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2, Plus, X, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'
import Posts from './Posts'
import { createApiUrl, API_ENDPOINTS } from '@/config/api'

const CreatePost=({open,setOpen})=> {

    const imageRef=useRef();
    const [file,setFile]=useState("");
    const [caption,setCaption]=useState("");
    const [imagepreview,setImagePreview]=useState("");
    const [loading,setLoading]=useState(false);
    const [postType, setPostType] = useState('image'); // 'image' or 'poll'
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']); // Minimum 2 options

    const {user}=useSelector(store=>store.auth);
    const {posts}=useSelector(store=>store.post);

    const dispatch=useDispatch();

    const fileChangeHandler=async(e)=>{
        const file=e.target.files?.[0];
        if (file){
            setFile(file);
            const dataUrl=await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    const addPollOption = () => {
        if (pollOptions.length < 4) { // Maximum 4 options
            setPollOptions([...pollOptions, '']);
        }
    };

    const removePollOption = (index) => {
        if (pollOptions.length > 2) { // Minimum 2 options
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };

    const updatePollOption = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const createPostHandler = async (e) => {
        if (postType === 'poll') {
            // Check if poll question is filled
            if (!pollQuestion.trim()) {
                toast.error('Please enter a poll question');
                return;
            }
            
            // Check if we have at least 2 non-empty options
            const validOptions = pollOptions.filter(opt => opt.trim());
            if (validOptions.length < 2) {
                toast.error('Please fill in at least 2 poll options');
                return;
            }
        }

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("postType", postType);
        
        if (postType === 'image' && imagepreview) {
            formData.append("image", file);
        } else if (postType === 'poll') {
            formData.append("pollQuestion", pollQuestion);
            formData.append("pollOptions", JSON.stringify(pollOptions.filter(opt => opt.trim())));
        }

        // Debug: Log what we're sending
        console.log('Sending form data:', {
            caption,
            postType,
            pollQuestion: postType === 'poll' ? pollQuestion : null,
            pollOptions: postType === 'poll' ? pollOptions.filter(opt => opt.trim()) : null,
            hasImage: postType === 'image' && !!imagepreview
        });

        try {
            setLoading(true);
            const res = await axios.post(createApiUrl(API_ENDPOINTS.ADD_POST), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setPosts([res.data.post,...posts]))
                toast.success(res.data.message);
                setOpen(false);
                // Reset form
                setCaption('');
                setFile('');
                setImagePreview('');
                setPostType('image');
                setPollQuestion('');
                setPollOptions(['', '']);
            }
        } catch (error) {
            console.log('Error creating post:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    }

    const resetForm = () => {
        setCaption('');
        setFile('');
        setImagePreview('');
        setPostType('image');
        setPollQuestion('');
        setPollOptions(['', '']);
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={()=>setOpen(false)} className="max-w-md">
                <DialogHeader className='text-center font-semibold'>
                    Create New post
                </DialogHeader>

                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="img"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 font-semibold text-xs'>Bio here...</span>
                    </div>
                </div>

                {/* Post Type Selector */}
                <div className="flex gap-2 mb-4">
                    <Button
                        variant={postType === 'image' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPostType('image')}
                        className="flex-1"
                    >
                        Image Post
                    </Button>
                    <Button
                        variant={postType === 'poll' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPostType('poll')}
                        className="flex-1"
                    >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Poll
                    </Button>
                </div>

                {/* Caption */}
                <Textarea 
                    value={caption} 
                    onChange={(e)=>setCaption(e.target.value)} 
                    className='focus-visible:ring-transparent border-none' 
                    placeholder="Write a caption..."
                />

                {/* Poll Creation */}
                {postType === 'poll' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Poll Question</label>
                            <Input
                                value={pollQuestion}
                                onChange={(e) => setPollQuestion(e.target.value)}
                                placeholder="Ask a question..."
                                className="mt-1"
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">Options</label>
                            <div className="space-y-2 mt-1">
                                {pollOptions.map((option, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => updatePollOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        {pollOptions.length > 2 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePollOption(index)}
                                                className="px-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {pollOptions.length < 4 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addPollOption}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Option
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Upload */}
                {postType === 'image' && (
                    <>
                        {imagepreview && (
                            <div className='w-full h-64 flex items-center justify-center'>
                                <img src={imagepreview} alt='preview_img' className='object-cover h-full w-full rounded-md'/>
                            </div>
                        )}

                        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
                        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>
                            Select from computer
                        </Button>
                    </>
                )}

                {/* Submit Button */}
                {(imagepreview || postType === 'poll') && (
                    loading ? (
                        <Button disabled className="w-full">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={createPostHandler} type="submit" className="w-full">
                            {postType === 'poll' ? 'Create Poll' : 'Post'}
                        </Button>
                    )
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost