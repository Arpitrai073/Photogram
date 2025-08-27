import React from 'react'
import Posts from './Posts'

function Feed() {
  return (
    <div className='flex-1 my-8 mb-20 lg:mb-8 flex flex-col items-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Posts/>
    </div>
  )
}

export default Feed