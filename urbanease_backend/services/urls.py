from django.urls import path
from . import views

urlpatterns = [
    path("categories/", views.list_categories, name="service-categories"),
    path("", views.list_services, name="services-list"),          # GET
    path("create/", views.create_service, name="service-create"), # POST
    path("<int:pk>/", views.service_detail)
]
