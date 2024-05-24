from django.db import models

# Create your models here.
class Weather(models.Model):
    date_time = models.CharField(default='7/30/2023  1:00:00 AM', max_length=30)
    ambient_temperature = models.CharField(max_length=30)
    irradiance = models.FloatField(default=0)
    temperature_module_1 = models.FloatField(default=0)

    def __str__(self) -> str:
        return super().__str__()
    
class SolarEnergy(models.Model):
    date_time = models.CharField(default='7/30/2023  1:00:00 AM', max_length=30)
    pv_power_generation_inverter = models.FloatField(default=0)
    pv_power_generation_power_meter = models.FloatField(default=0)
    excess_energy = models.FloatField(default=0)
    purchased = models.FloatField(default=0)
    voltage_a = models.FloatField(default=0)
    voltage_b = models.FloatField(default=0)
    voltage_c = models.FloatField(default=0)
    current_a = models.FloatField(default=0)
    current_b = models.FloatField(default=0)
    current_c = models.FloatField(default=0)
    frequency = models.FloatField(default=0)
    active_power = models.FloatField(default=0)
    reactive_power = models.FloatField(default=0)
    power_factor = models.FloatField(default=0)
    ambient_temperature = models.FloatField(default=0)
    irradiance = models.FloatField(default=0)
    temperature_module_1 = models.FloatField(default=0)
    temperature_module_2 = models.FloatField(default=0)

    def __str__(self) -> str:
        return super().__str__()
    
class PredictEnergy(models.Model):
    date_time = models.CharField(default='7/30/2023  1:00:00 AM', max_length=30)
    power_generation = models.FloatField(default=0)