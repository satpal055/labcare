
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

function Header({ onMenuClick }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const userName = user?.name || 'Administrator'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <span className="text-xl">☰</span>
          </button>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              LabCare / Management
            </p>

            <h2 className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
              Medical Laboratory System
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-4 ring-blue-50">
              {userInitial}
            </div>

            <div className="hidden sm:block">
              <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                {userName}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user?.role || 'Administrator'}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 sm:px-4"
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">↪</span>
          </button>

        </div>
      </div>
    </header>
  )
}

export default Header
