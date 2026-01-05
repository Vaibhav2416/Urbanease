import { Link } from "react-router-dom"

export default function BookingSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow p-8 rounded text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Booking Successful 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          Your booking request has been sent to providers.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
