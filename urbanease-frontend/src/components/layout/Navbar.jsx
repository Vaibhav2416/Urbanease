import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { user, isAuthenticated, logout } = useAuth()

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            UrbanEase
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-indigo-600">
              Services
            </Link>

            {user?.role === "Provider" && (
              <Link to="/provider" className="text-gray-600 hover:text-indigo-600">
                Dashboard
              </Link>
            )}

            <Link to="/provider" className="text-gray-600 hover:text-indigo-600">
              Become a Provider
            </Link>
          </div>

          {/* Right side */}
          {!isAuthenticated ? (
            // 🔓 Logged OUT
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            // 🔐 Logged IN
            <div className="relative flex items-center gap-4" ref={dropdownRef}>
              <Link
                to="/my-bookings"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Bookings
              </Link>
            
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                {user?.name}
                <span className="text-sm">▼</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-34 w-40 bg-white border rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}
