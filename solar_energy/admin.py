from django.contrib import admin
from .models import Weather, SolarEnergy, PredictEnergy

class WeatherAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['date']}),
        (None,               {'fields': ['time']}),
        (None,               {'fields': ['ambient_temperature']}),
        (None,               {'fields': ['irradiance']}),
        (None,               {'fields': ['temperature_module_1']}),
    ]
    list_display = ('date', 'time', 'ambient_temperature', 'irradiance', 'temperature_module_1')

class SolarEnergyAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['date']}),
        (None,               {'fields': ['time']}),
        (None,               {'fields': ['pv_power_generation_inverter']}),
        (None,               {'fields': ['pv_power_generation_power_meter']}),
        (None,               {'fields': ['excess_energy']}),
        (None,               {'fields': ['purchased']}),
        (None,               {'fields': ['voltage_a']}),
        (None,               {'fields': ['voltage_b']}),
        (None,               {'fields': ['voltage_c']}),
        (None,               {'fields': ['current_a']}),
        (None,               {'fields': ['current_b']}),
        (None,               {'fields': ['current_c']}),
        (None,               {'fields': ['frequency']}),
        (None,               {'fields': ['active_power']}),
        (None,               {'fields': ['reactive_power']}),
        (None,               {'fields': ['power_factor']}),
        (None,               {'fields': ['ambient_temperature']}),
        (None,               {'fields': ['irradiance']}),
        (None,               {'fields': ['temperature_module_1']}),
        (None,               {'fields': ['temperature_module_2']}),
    ]
    list_display = (
        'date',
        'time',
        'pv_power_generation_inverter',
        'pv_power_generation_power_meter',
        'excess_energy',
        'purchased',
        'voltage_a',
        'voltage_b',
        'voltage_c',
        'current_a',
        'current_b',
        'current_c',
        'frequency',
        'active_power',
        'reactive_power',
        'power_factor',
        'ambient_temperature',
        'irradiance',
        'temperature_module_1',
        'temperature_module_2',
    )

class PredictionEnergyAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['date']}),
        (None,               {'fields': ['time']}),
        (None,               {'fields': ['power_generation']}),
    ]
    list_display = ('date', 'time', 'power_generation')


admin.site.register(Weather, WeatherAdmin)
admin.site.register(SolarEnergy, SolarEnergyAdmin)
admin.site.register(PredictEnergy, PredictionEnergyAdmin)