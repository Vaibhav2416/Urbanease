import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosClient from "../../api/axiosClient"
import { useAuth } from "../../context/AuthContext"

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    axiosClient
      .get(`/services/${id}/`)
      .then((res) => setService(res.data))
      .catch(() => setError("Service not found"))
      .finally(() => setLoading(false))
  }, [id])

  const handleBooking = async (e) => {
    e.preventDefault()
    setError("")

    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    try {
      await axiosClient.post("/bookings/create/", {
        service: service.id,
        scheduled_at: scheduledAt,
        address: address,
      })
      navigate("/booking-success")
    } catch (err) {
      setError("Failed to create booking")
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  if (!service) {
    return <div className="p-10 text-center text-red-500">Service not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8">

        {/* Service Info */}
        <div>
          <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
            Image
          </div>
          <h1 className="text-2xl font-bold">{service.name}</h1>
          <p className="text-gray-600 mt-2">{service.description}</p>

          <div className="mt-4 flex gap-6">
            <div>
              <span className="font-semibold text-indigo-600">
                ₹{service.base_price}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {service.duration_in_minutes} mins
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Book this service</h2>

          {error && (
            <div className="mb-3 text-red-500 text-sm">{error}</div>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Service Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Confirm Booking
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
