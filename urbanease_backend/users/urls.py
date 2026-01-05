from django.urls import path
from . import views
urlpatterns=[
    path('register/',views.RegisterUser),
    path('',views.GetUsers),
    path('login/',views.login_user),
    path('me/',views.me,name="me")
]
