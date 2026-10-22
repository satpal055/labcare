const stats = [
  {
    title: 'Total Patients',
    value: '1,248',
    change: '+12.5%',
    icon: '♙',
  },
  {
    title: 'Total Doctors',
    value: '86',
    change: '+4.2%',
    icon: '⚕',
  },
  {
    title: 'Total Tests',
    value: '142',
    change: '+8.1%',
    icon: '▤',
  },
  {
    title: 'Pending Reports',
    value: '24',
    change: '-6.4%',
    icon: '▧',
  },
]

const recentBookings = [
  {
    patient: 'Rahul Sharma',
    test: 'Complete Blood Count',
    doctor: 'Dr. Amit Kumar',
    status: 'Completed',
  },
  {
    patient: 'Priya Singh',
    test: 'Liver Function Test',
    doctor: 'Dr. Neha Sharma',
    status: 'Processing',
  },
  {
    patient: 'Aman Verma',
    test: 'Thyroid Profile',
    doctor: 'Dr. Raj Mehta',
    status: 'Pending',
  },
  {
    patient: 'Pooja Gupta',
    test: 'Blood Sugar',
    doctor: 'Dr. Amit Kumar',
    status: 'Completed',
  },
]

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here's what's happening in your laboratory today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  {stat.change} from last month
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                {stat.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recent Bookings */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest patient test bookings
              </p>
            </div>

            <button
              type="button"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Patient
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Test
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Doctor
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.patient}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {booking.patient}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {booking.test}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {booking.doctor}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex rounded-full px-3 py-1
                          text-xs font-semibold
                          ${
                            booking.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : booking.status === 'Processing'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }
                        `}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Frequently used actions
          </p>

          <div className="mt-5 space-y-3">

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                +
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Add Patient
                </p>

                <p className="text-xs text-slate-500">
                  Register a new patient
                </p>
              </div>
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                +
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  New Booking
                </p>

                <p className="text-xs text-slate-500">
                  Book a laboratory test
                </p>
              </div>
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                +
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Create Report
                </p>

                <p className="text-xs text-slate-500">
                  Generate a patient report
                </p>
              </div>
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard