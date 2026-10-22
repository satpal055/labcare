import { NavLink } from 'react-router-dom'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '▦',
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: '♙',
  },
  {
    name: 'Doctors',
    path: '/doctors',
    icon: '⚕',
  },
  {
    name: 'Tests',
    path: '/tests',
    icon: '▤',
  },
    {
    name: 'Categories',
    path: '/categories',
    icon: '▥',
  },
  {
  name: 'Prices',
  path: '/prices',
  icon: '₹',
},
  {
    name: 'Bookings',
    path: '/bookings',
    icon: '◷',
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: '▧',
  },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72
          bg-slate-950 text-white
          transform transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex h-20 items-center border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">
                L
              </div>

              <div>
                <h1 className="text-lg font-bold">
                  LabCare
                </h1>

                <p className="text-xs text-slate-400">
                  Laboratory System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">

            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Main Menu
            </p>

            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 rounded-xl px-4 py-3
                  text-sm font-medium transition
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }
                  `
                }
              >
                <span className="flex w-6 justify-center text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}

            <div className="pt-6">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                System
              </p>

              <NavLink
                to="/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 rounded-xl px-4 py-3
                  text-sm font-medium transition
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }
                  `
                }
              >
                <span className="flex w-6 justify-center text-lg">
                  ⚙
                </span>

                <span>Settings</span>
              </NavLink>
            </div>
          </nav>

          {/* Bottom */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs text-slate-400">
                Logged in as
              </p>

              <p className="mt-1 text-sm font-semibold">
                Administrator
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}

export default Sidebar