import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './routes/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients/Patients'
import NewPatient from './pages/Patients/NewPatient'
import PatientDetails from './pages/Patients/PatientDetails'
import EditPatient from './pages/Patients/EditPatient'
import Doctors from './pages/Doctors/Doctors'
import NewDoctor from './pages/Doctors/NewDoctor'
import DoctorDetails from './pages/Doctors/DoctorDetails'
import EditDoctor from './pages/Doctors/EditDoctor'
import Tests from './pages/Tests/Tests'
import NewTest from './pages/Tests/NewTest'
import TestDetails from './pages/Tests/TestDetails'
import EditTest from './pages/Tests/EditTest'
import Categories from './pages/Categories/Categories'
import NewCategory from './pages/Categories/NewCategory'
import EditCategory from './pages/Categories/EditCategory'
import Prices from './pages/Prices/Prices'
import Bookings from './pages/Bookings/Bookings'
import NewBooking from './pages/Bookings/NewBooking'
import BookingDetails from './pages/Bookings/BookingDetails'
import Reports from './pages/Reports/Reports'
import ReportDetails from './pages/Reports/ReportDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
  path="/doctors"
  element={<Doctors />}
/>
<Route
  path="/doctors/new"
  element={<NewDoctor />}
/>
<Route path="/doctors/:id/edit" element={<EditDoctor />} />
<Route path="/categories" element={<Categories />} />
<Route path="/categories/new" element={<NewCategory />} />
<Route
  path="/categories/:id/edit"
  element={<EditCategory />}
/>
<Route path="/prices" element={<Prices />} />
<Route
  path="/doctors/:id"
  element={<DoctorDetails />}
/>
<Route path="/tests" element={<Tests />} />
<Route path="/tests/new" element={<NewTest />} />
<Route path="/tests/:id/edit" element={<EditTest />} />
<Route path="/tests/:id" element={<TestDetails />} />
<Route path="/bookings" element={<Bookings />} />
<Route
  path="/bookings/new"
  element={<NewBooking />}
/>
<Route path="/reports" element={<Reports />} />
<Route
  path="/reports/:id"
  element={<ReportDetails />}
/>
<Route
  path="/bookings/:id"
  element={<BookingDetails />}
/>
          <Route
            path="/patients/new"
            element={<NewPatient />}
          />
        </Route>
        <Route
  path="/patients/:id/edit"
  element={<EditPatient />}
/>
        <Route
  path="/patients/:id"
  element={<PatientDetails />}
/>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App