import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyBookings, deleteBooking } from "../../api/bookingApi"

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this booking?")) return

    try {
      await deleteBooking(id)
      setBookings((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      alert("Unable to delete booking")
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white shadow rounded p-4 mb-4"
        >
          <h3 className="font-semibold text-lg">
            {booking.service_details?.name || "Service"}
          </h3>

          <p className="text-sm text-gray-500">
            {new Date(booking.scheduled_at).toLocaleString()}
          </p>

          <p className="text-sm text-gray-500">{booking.address}</p>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium">
              Status: {booking.status}
            </span>

            {/* Actions */}
            {booking.status === "Pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/my-bookings/${booking.id}/edit`, {
                      state: booking,
                    })
                  }
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(booking.id)}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
