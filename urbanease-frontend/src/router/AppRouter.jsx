import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/Home'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import ProviderDashboard from '../pages/provider/ProviderDashboard'
import ServicesList from '../pages/customer/ServiceList'
import ServiceDetail from '../pages/customer/ServiceDetail'
import BookingSuccess from '../pages/customer/BookingSuccess'
import MyBookings from '../pages/customer/MyBooking'
import EditBooking from '../pages/customer/EditBooking'

const AppRouter = () => {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<ServicesList />} />

        {/* Provider routes (protected later) */}
        <Route path="/provider" element={
           <ProtectedRoute role="Provider">
              <ProviderDashboard />
           </ProtectedRoute>
          } />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
       <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="Customer">
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings/:id/edit"
          element={
            <ProtectedRoute role="Customer">
              <EditBooking />
            </ProtectedRoute>
          }
        />
        {/* 404 fallback */}
        {/* <Route
          path="*"
          element={
            <div className="p-10 text-center text-gray-500">
              Page not found
            </div>
          }
        /> */}
    </Routes>
  )
}

export default AppRouter