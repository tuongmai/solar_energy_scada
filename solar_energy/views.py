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

import requests
import json
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

from datetime import datetime
from .models import SolarEnergy

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

def separate_datetime(datetime_str):
    dt = datetime.strptime(datetime_str, '%m/%d/%Y %H:%M:%S')
    date_str = dt.strftime('%Y-%m-%d')
    time_str = dt.strftime('%H:%M')
    return date_str, time_str

@method_decorator(csrf_exempt, name='dispatch')
class SolarEnergyView(View):
    # def get(self, request, *args, **kwargs):
    #     # start_date = request.GET.get('start_date')
    #     # end_date = request.GET.get('end_date')
    #     start_date_str = request.GET.get('start_date')
    #     end_date_str = request.GET.get('end_date')
        
    #     # if not start_date or not end_date:
    #     if not start_date_str or not end_date_str:
    #         return JsonResponse({'error': 'Please provide both start_date and end_date'}, status=400)
        
    #     try:
    #         # start_date_obj = parse_date(start_date)
    #         # end_date_obj = parse_date(end_date)
    #         start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    #         start_date_parsed = start_date.strftime('%Y-%m-%d')
    #         end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    #         end_date_parsed = end_date.strftime('%Y-%m-%d')
    #         # if not start_date_obj or not end_date_obj:
    #         #     raise ValueError
    #     except ValueError:
    #         return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        
    #     # solar_energies = SolarEnergy.objects.filter(date=(start_date_obj, end_date_obj))
    #     solar_energies = SolarEnergy.objects.filter(date=(start_date_parsed, end_date_parsed))
    #     solar_energies_json = serialize('json', solar_energies)
    #     return JsonResponse(solar_energies_json, safe=False)
    
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