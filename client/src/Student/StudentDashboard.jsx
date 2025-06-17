
import StudentNavigation from './StudentNavigation'
import { Outlet } from 'react-router-dom'

function StudentDashboard() {
  return (
    <div>
      <div className='flex'>
        <StudentNavigation />
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default StudentDashboard
