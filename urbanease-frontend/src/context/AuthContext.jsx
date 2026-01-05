import { createContext, useContext, useEffect, useState } from "react"
import axiosClient from "../api/axiosClient"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user on app start if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (token) {
      axiosClient
        .get("/auth/me/")
        .then((res) => {
          setUser(res.data)
        })
        .catch(() => {
          logout()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (loginResponse) => {
    localStorage.setItem("access_token", loginResponse.access)
    localStorage.setItem("refresh_token", loginResponse.refresh)
    setUser(loginResponse.user)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = () => useContext(AuthContext)
