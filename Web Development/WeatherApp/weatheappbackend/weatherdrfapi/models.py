from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator
# Create your models here.

class Country(models.Model):
    country = models.TextField(null=False,unique=True)

   
    def __str__(self):
        return self.country

class State(models.Model):
    country = models.ForeignKey(Country,on_delete=models.RESTRICT,db_index=True)
    state = models.TextField(null=False)
   
    def __str__(self):
        return self.state

class City(models.Model):
    city = models.TextField(null=False)
    state = models.ForeignKey(State,on_delete=models.RESTRICT,db_index=True)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)],
    )

    # Longitude ranges from -180.0 to 180.0
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)],
    )

    
    def __str__(self):
            return self.city