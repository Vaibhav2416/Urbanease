import axiosClient from "./axiosClient"

export const getMyBookings = () => {
  return axiosClient.get("/bookings/")
}

export const deleteBooking = (id) => {
  return axiosClient.delete(`/bookings/provider/${id}/delete/`)
}

export const updateBooking = (id, data) => {
  return axiosClient.patch(`/bookings/provider/${id}/update/`, data)
}
