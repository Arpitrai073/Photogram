import { Label } from '@radix-ui/react-label';
import React, { use, useEffect, useState } from 'react'
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import store from '@/redux/store';
import { createApiUrl, API_ENDPOINTS } from '@/config/api';
const Login = ()=> {
    const [input,setInput]=useState({
       
        email:'',
        password:''
    })
    const [loading,setLoading]=useState(false);

    const dispatch=useDispatch();
    const {user} = useSelector(store=>store.auth);

    const navigate=useNavigate();
    const changeEventHandler=(e)=>{
        setInput({
            ...input, [e.target.name]:e.target.value});
    }
    const signupHandler=async(e)=>{
        e.preventDefault();
        
        console.log(input);
        try {
            setLoading(true);
            const res=await axios.post(createApiUrl(API_ENDPOINTS.LOGIN),input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if (res.data.success){

                dispatch(setAuthUser(res.data.user))

                navigate("/");

                toast.success(res.data.message);
                setInput({
                   
                    email:'',
                    password:''
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally {
            setLoading(false);
        }

    }
       
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

  return (
   
    <div className='flex items-center w-screen h-screen justify-center'>
  <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
    <div className='my-4'>
        <h1 className='text-center font-bold text-xl'style={{ fontFamily: '"Grand Hotel", cursive' }}>Photogram</h1>
        <p className='text-sm text-center '>Login to see photos from your friends</p>
    </div>
   
    <div>
        <span className=' font-medium '>Email</span>
        <Input type="email"
        name='email'
        value={input.email}
        onChange={changeEventHandler}
        className="focus-visible:ring-transparent my-2" />

    </div>
    <div>
        <span className=' font-medium '>Password</span>
        <Input type="password"
        name='password'
        value={input.password}
        onChange={changeEventHandler}
        className="focus-visible:ring-transparent my-2" />
     

    </div>
    {
        loading?(<Button>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'
            />Please wait
        </Button>):( <Button type='submit' >Login</Button>)
    }
   
    <span className='text-center'>Don't have an account? <Link to='/signup' className='text-blue-500'>Register</Link></span>

  </form>
  </div>
)
}

export default Login;