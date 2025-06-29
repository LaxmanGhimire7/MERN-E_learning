import React from 'react'
import InstructorNavigation from './InstructorNavigation'
import { Outlet } from 'react-router-dom'

function InstructorDashboard() {
  return (
    <div className='flex'>
      <div className='w-[250px]'>
        <InstructorNavigation />
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default InstructorDashboard
