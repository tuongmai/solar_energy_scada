from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.core.serializers import serialize
from django.utils.dateparse import parse_date
from django.template import loader
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods

import os
import requests
import json
import openmeteo_requests
import requests_cache
import pandas as pd
import xgboost as xgb
import pickle
import numpy as np
from retry_requests import retry

from datetime import datetime
from .models import SolarEnergy

# Load the trained XGBoost model
model_path = os.path.join(os.path.dirname(__file__), 'model', 'bst_model_v2.pck')
xgbModel = pickle.load(open(model_path, "rb"))
MAX = 868.3506

# @method_decorator(csrf_exempt, name='dispatch')
def weather_forecast(request):
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    # Make sure all required weather variables are listed here
    # The order of variables in minutely_15 or daily is important to assign them correctly below
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 12.0530676,
        "longitude": 107.1577547,
        "minutely_15": ["temperature_2m", "direct_normal_irradiance"],
        "timezone": "Asia/Bangkok",
        "start_date": start_date,
	    "end_date": end_date
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]

    # Process minutely_15 data. The order of variables needs to be the same as requested.
    minutely_15 = response.Minutely15()
    minutely_15_temperature_2m = minutely_15.Variables(0).ValuesAsNumpy()
    # minutely_15_soil_temperature_0cm = minutely_15.Variables(1).ValuesAsNumpy()
    minutely_15_direct_normal_irradiance = minutely_15.Variables(1).ValuesAsNumpy()

    minutely_15_data = {"date": pd.date_range(
        start = pd.to_datetime(minutely_15.Time(), unit = "s", utc = True),
        end = pd.to_datetime(minutely_15.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = minutely_15.Interval()),
        inclusive = "left"
    )}
    minutely_15_data["temperature_2m"] = minutely_15_temperature_2m
    # minutely_15_data["soil_temperature_0cm"] = minutely_15_soil_temperature_0cm
    minutely_15_data["direct_normal_irradiance"] = minutely_15_direct_normal_irradiance

    minutely_15_dataframe = pd.DataFrame(data = minutely_15_data)
    # print(minutely_15_dataframe)
    data = minutely_15_dataframe.to_json()
    # return HttpResponse(data)
    return JsonResponse({"data": data}, status=200)

# def weather_archive(request):


def home_page(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

def separate_datetime(datetime_str):
    dt = datetime.strptime(datetime_str, '%m/%d/%Y %H:%M:%S')
    date_str = dt.strftime('%Y-%m-%d')
    time_str = dt.strftime('%H:%M')
    return date_str, time_str

@method_decorator(csrf_exempt, name='dispatch')
class SolarEnergyView(View):
    
    def get(self, request, *args, **kwargs):
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        
        if not start_date_str or not end_date_str:
            return JsonResponse({'error': 'Please provide both start_datetime and end_datetime'}, status=400)
        
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

        solar_energies = SolarEnergy.objects.filter(date__gte=start_date, date__lte=end_date)
        solar_energies_json = serialize('json', solar_energies)
        return JsonResponse(solar_energies_json, safe=False)
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            if not isinstance(data, list):
                return JsonResponse({'error': 'Expected a list of items'}, status=400)
            
            solar_energies = []
            for item in data:
                date, time = separate_datetime(item['date_time'])
                item['date'] = date
                item['time'] = time
                del item['date_time']
                obj = SolarEnergy(**item)
                solar_energies.append(obj)
            
            SolarEnergy.objects.bulk_create(solar_energies)
            return JsonResponse({'status': 'success'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
@csrf_exempt
@require_http_methods(["POST"])
def proxy_request(request):
    url = 'http://sol-scada.com/DataRealTime/Read'  # External API URL

    headers = {
        'Content-Type': 'application/json',
    }

    # Forward the request to the external server
    response = requests.post(url, headers=headers, json=request.json())

    # Return the response from the external server
    return JsonResponse(response.json(), status=response.status_code)

def get_weather_forecasting_for_predict(start_date, end_date):
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
        "timezone": "Asia/Bangkok",
        "start_date": start_date,
        "end_date": end_date
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    print(f"Elevation {response.Elevation()} m asl")
    print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
    print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

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
    hourly_data["ambient_temparature"] = hourly_temperature_2m
    hourly_data["temparature"] = hourly_soil_temperature_0cm
    hourly_data["irradiance"] = hourly_direct_normal_irradiance

    hourly_dataframe = pd.DataFrame(data = hourly_data)
    return hourly_dataframe

def predict_solar_energy(request):
    if request.method == 'GET':
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        weather_dataframe = get_weather_forecasting_for_predict(start_date, end_date)
        feature = weather_dataframe.drop(["date"], axis=1).copy()

        dmatrix = xgb.DMatrix(feature)

        # Make prediction using the loaded XGBoost model
        prediction = xgbModel.predict(dmatrix)
        prediction *= MAX
        weather_dataframe["power"] = prediction

        data = weather_dataframe.to_json()

        return JsonResponse({'data': data}, status=200)
    else:
        return JsonResponse({'error': 'Only GET requests allowed'})
