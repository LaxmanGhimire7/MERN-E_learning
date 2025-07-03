
import StudentNavigation from './StudentNavigation'
import { Outlet } from 'react-router-dom'

function StudentDashboard() {
  return (
    <div className='flex  '>
      <div className='w-[300px]'>
        <StudentNavigation />
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default StudentDashboard
