import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function EditDoctor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    doctorId: '',
    firstName: '',
    lastName: '',
    specialization: '',
    qualification: '',
    registrationNumber: '',
    gender: '',
    phone: '',
    email: '',
    experience: '',
    consultationFee: '',
    city: '',
    address: '',
    bio: '',
  })

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/doctors/${id}`)

        const doctor = response.data.doctor

        setFormData({
          doctorId: doctor.doctorId || '',
          firstName: doctor.firstName || '',
          lastName: doctor.lastName || '',
          specialization: doctor.specialization || '',
          qualification: doctor.qualification || '',
          registrationNumber: doctor.registrationNumber || '',
          gender: doctor.gender || '',
          phone: doctor.phone || '',
          email: doctor.email || '',
          experience: doctor.experience ?? '',
          consultationFee: doctor.consultationFee ?? '',
          city: doctor.city || '',
          address: doctor.address || '',
          bio: doctor.bio || '',
        })
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load doctor details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      await api.put(`/doctors/${id}`, {
        ...formData,
        experience:
          formData.experience === ''
            ? 0
            : Number(formData.experience),
        consultationFee:
          formData.consultationFee === ''
            ? 0
            : Number(formData.consultationFee),
      })

      navigate(`/doctors/${id}`)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to update doctor.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading doctor details...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/doctors/${id}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Doctor Details
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Edit Doctor
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update doctor information and save the changes.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Professional Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Professional Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Doctor ID"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            />

            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />

            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />

            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Personal Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Practice Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Practice Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Experience (Years)"
              name="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={handleChange}
            />

            <Input
              label="Consultation Fee (₹)"
              name="consultationFee"
              type="number"
              min="0"
              value={formData.consultationFee}
              onChange={handleChange}
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter clinic or practice address"
              />
            </div>
          </div>
        </div>

        {/* Professional Bio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Professional Bio
          </h2>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="5"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter professional biography"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to={`/doctors/${id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  min,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default EditDoctor