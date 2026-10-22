import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'


function Header({ onMenuClick }) {
  const dispatch = useDispatch()
const navigate = useNavigate()

const { user } = useSelector(
  (state) => state.auth
)

const handleLogout = () => {
  dispatch(logout())
  navigate('/login')
}
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <span className="text-xl">
              ☰
            </span>
          </button>

          <div>
            <p className="text-sm text-slate-500">
              Medical Laboratory
            </p>

            <h2 className="text-lg font-bold text-slate-800">
              Management System
            </h2>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
          >
            <span className="text-xl">
              🔔
            </span>

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              A
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
  {user?.name || 'User'}
</p>

<p className="text-xs text-slate-500">
  {user?.role || 'User'}
</p>

            </div>
            <button
  type="button"
  onClick={handleLogout}
  className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
>
  Logout
</button>
          </div>

        </div>

      </div>
    </header>
  )
}

export default Header