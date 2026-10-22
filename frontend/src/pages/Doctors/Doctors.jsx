import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [gender, setGender] = useState('')

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/doctors', {
        params: {
          search,
          city,
          specialization,
          gender,
        },
      })

      setDoctors(response.data.doctors)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load doctors.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    fetchDoctors()
  }

  const handleClear = () => {
    setSearch('')
    setCity('')
    setSpecialization('')
    setGender('')

    setTimeout(() => {
      fetchDoctors()
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Doctors
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage doctors and medical professionals
          </p>
        </div>

        <Link
          to="/doctors/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Doctor
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Name, ID, phone or specialization"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              City
            </label>

            <input
              type="text"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              placeholder="Jaipur"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Specialization
            </label>

            <input
              type="text"
              value={specialization}
              onChange={(event) =>
                setSpecialization(event.target.value)
              }
              placeholder="Pathologist"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gender
            </label>

            <select
              value={gender}
              onChange={(event) =>
                setGender(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-end gap-3 lg:col-span-5">
            <button
              type="submit"
              className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Doctors Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-800">
            Doctor List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {doctors.length} active doctor
            {doctors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              🩺
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No doctors found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">
                    Doctor
                  </th>

                  <th className="px-5 py-4">
                    Doctor ID
                  </th>

                  <th className="px-5 py-4">
                    Specialization
                  </th>

                  <th className="px-5 py-4">
                    Phone
                  </th>

                  <th className="px-5 py-4">
                    City
                  </th>

                  <th className="px-5 py-4">
                    Experience
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                          {doctor.firstName?.charAt(0)}
                          {doctor.lastName?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {doctor.firstName}{' '}
                            {doctor.lastName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {doctor.qualification}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      {doctor.doctorId}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {doctor.specialization}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {doctor.phone}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {doctor.city || '-'}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {doctor.experience || 0} years
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors