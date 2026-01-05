import { useEffect, useState } from "react"
import axiosClient from "../../api/axiosClient"
import { useAuth } from "../../context/AuthContext"

export default function ProviderDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get("/bookings/provider/incoming/")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const acceptBooking = async (bookingId) => {
    try {
      await axiosClient.post(`/bookings/provider/${bookingId}/accept/`)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "Accepted" } : b
        )
      )
    } catch (err) {
      console.error("Failed to accept booking")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading provider bookings...
      </div>
    )
  }
  const updateStatus = async (bookingId, status) => {
  try {
    await axiosClient.patch(`/bookings/provider/${bookingId}/status/`, {
      status,
    })

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      )
    )
  } catch (err) {
    console.error("Failed to update status")
  }
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">
        Provider Dashboard
      </h1>

      {bookings.length === 0 ? (
        <div className="text-gray-500">
          No booking requests yet
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center"
            >
              {/* Left */}
              <div>
                <h3 className="font-semibold text-lg">
                  {booking.service?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Customer: {booking.customer?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.scheduled_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.address}
                </p>
              </div>

              {/* Right */}
              <div className="mt-3 md:mt-0 flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      booking.status === "Accepted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {booking.status}
                </span>

                {booking.status === "Pending" && (
                  <button
                    onClick={() => acceptBooking(booking.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Accept
                  </button>
                )}
                {booking.status === "Accepted" && (
                        <button
                          onClick={() => updateStatus(booking.id, "In Progress")}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Start
                        </button>
                      )}

                      {booking.status === "In Progress" && (
                        <button
                          onClick={() => updateStatus(booking.id, "Completed")}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
