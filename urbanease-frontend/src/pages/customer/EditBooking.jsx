import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { updateBooking } from "../../api/bookingApi"

export default function EditBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [scheduledAt, setScheduledAt] = useState(state.scheduled_at)
  const [address, setAddress] = useState(state.address)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateBooking(id, {
        scheduled_at: scheduledAt,
        address,
      })
      navigate("/my-bookings")
    } catch (err) {
      alert("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          Edit Booking
        </h2>

        <label className="block text-sm mb-1">Date & Time</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <label className="block text-sm mb-1">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Updating..." : "Update Booking"}
        </button>
      </form>
    </div>
  )
}
