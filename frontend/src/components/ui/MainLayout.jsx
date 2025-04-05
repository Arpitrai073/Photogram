import { Sidebar } from 'lucide-react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
  return (
    <div>
        <LeftSidebar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout