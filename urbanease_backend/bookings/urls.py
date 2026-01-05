from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_my_bookings, name="my-bookings"),        # GET /api/bookings/
    path("create/", views.create_booking, name="create-booking"), # POST /api/bookings/create/
    path("provider/incoming/", views.provider_incoming_bookings, name="provider-incoming"),
    path("provider/<int:booking_id>/accept/", views.provider_accept_booking, name="provider-accept"),
    path("provider/<int:booking_id>/status/", views.provider_update_status, name="provider-update-status"),
    path("provider/<int:booking_id>/update/", views.update_booking), # PATCH
    path("provider/<int:booking_id>/delete/", views.delete_booking), # DELETE
]
