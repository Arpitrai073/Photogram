import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './feed'
import RightSidebar from '../RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUser'

function Home() {

  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className='flex'>
        <div className='flex-grow '>
<Feed/>
<Outlet/>

        </div>
        <RightSidebar/>

    </div>
  )
}

export default Home