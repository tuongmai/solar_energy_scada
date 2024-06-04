from django.urls import path
from . import views
from .views import SolarEnergyView, proxy_request

urlpatterns = [
    path('home', views.home_page, name='home_page'),
    path('weather_forecast', views.weather_forecast, name='weather_forecast'),
    path('api/solar-energy', SolarEnergyView.as_view(), name='solar-energy-date-range'),
    path('proxy', proxy_request, name='proxy_request'),
    path('predict', views.predict_solar_energy, name='proxy_request'),
]