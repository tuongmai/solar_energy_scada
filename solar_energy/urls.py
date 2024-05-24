from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home_page, name='home_page'),
    path('weather_info/', views.weather_info, name='weather_info'),
]