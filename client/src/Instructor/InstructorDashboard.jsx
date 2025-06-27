import React from 'react'
import InstructorNavigation from './InstructorNavigation'
import { Outlet } from 'react-router-dom'

function InstructorDashboard() {
  return (
    <div>
      <div className='w-[400px]'>
        <InstructorNavigation />
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default InstructorDashboard
