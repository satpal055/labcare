
import { NavLink } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '▦' },
  { name: 'Patients', path: '/patients', icon: '♙' },
  { name: 'Doctors', path: '/doctors', icon: '⚕' },
  { name: 'Tests', path: '/tests', icon: '▤' },
  { name: 'Categories', path: '/categories', icon: '▥' },
  { name: 'Prices', path: '/prices', icon: '₹' },
  { name: 'Bookings', path: '/bookings', icon: '◷' },
  { name: 'Reports', path: '/reports', icon: '▧' },
]

function Sidebar({ isOpen, onClose }) {
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold shadow-lg shadow-blue-600/20">
              L
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">LabCare</h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Laboratory Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              className={linkClass}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg transition group-hover:bg-white/10">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="pt-7">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              System
            </p>

            <NavLink
              to="/settings"
              onClick={onClose}
              className={linkClass}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg">
                ⚙
              </span>
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Admin Profile */}
        <div className="shrink-0 border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                Administrator
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                LabCare Admin
              </p>
            </div>

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
