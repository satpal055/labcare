import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function NewDoctor() {
  const navigate = useNavigate()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    doctorId: '',
    firstName: '',
    lastName: '',
    specialization: '',
    qualification: '',
    phone: '',
    email: '',
    gender: '',
    experience: '',
    consultationFee: '',
    address: '',
    city: '',
    registrationNumber: '',
    bio: '',
  })

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')

    try {
      await api.post('/doctors', {
        doctorId: formData.doctorId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialization: formData.specialization,
        qualification: formData.qualification,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        experience: Number(formData.experience) || 0,
        consultationFee:
          Number(formData.consultationFee) || 0,
        address: formData.address,
        city: formData.city,
        registrationNumber:
          formData.registrationNumber,
        bio: formData.bio,
      })

      navigate('/doctors')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to create doctor.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/doctors')}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Doctors
        </button>

        <h1 className="mt-3 text-2xl font-bold text-slate-800">
          Add Doctor
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a new doctor to the laboratory system
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Professional Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Professional Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Doctor ID
              </label>

              <input
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="DOC-000002"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                First Name
              </label>

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Last Name
              </label>

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Specialization
              </label>

              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Pathologist"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Qualification
              </label>

              <input
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. MD Pathology"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Registration Number
              </label>

              <input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="Medical registration number"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Personal Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  Select gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* Practice Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Practice Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience
              </label>

              <input
                type="number"
                min="0"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Consultation Fee
              </label>

              <input
                type="number"
                min="0"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="₹"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                City
              </label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Jaipur"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Address
              </label>

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Clinic / laboratory address"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Professional Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Short professional description"
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving Doctor...'
              : 'Save Doctor'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewDoctor