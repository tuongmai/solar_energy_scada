from django.urls import path
from . import views
from .views import SolarEnergyView, proxy_request

urlpatterns = [
    path('home', views.home_page, name='home_page'),
    path('weather_info', views.weather_info, name='weather_info'),
    path('api/solar-energy', SolarEnergyView.as_view(), name='solar-energy-date-range'),
    path('proxy', proxy_request, name='proxy_request'),
]