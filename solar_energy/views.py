from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.template import loader

import json
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

def weather_info(request):
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)

    # Make sure all required weather variables are listed here
    # The order of variables in hourly or daily is important to assign them correctly below
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 12.0530676,
        "longitude": 107.1577547,
        "hourly": ["temperature_2m", "soil_temperature_0cm", "direct_normal_irradiance"],
        "timezone": "Asia/Bangkok"
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]

    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_soil_temperature_0cm = hourly.Variables(1).ValuesAsNumpy()
    hourly_direct_normal_irradiance = hourly.Variables(2).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}
    hourly_data["temperature_2m"] = hourly_temperature_2m
    hourly_data["soil_temperature_0cm"] = hourly_soil_temperature_0cm
    hourly_data["direct_normal_irradiance"] = hourly_direct_normal_irradiance

    hourly_dataframe = pd.DataFrame(data = hourly_data)
    print(hourly_dataframe)
    data = hourly_dataframe.to_json()
    return HttpResponse(data)

def home_page(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())