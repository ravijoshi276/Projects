from rest_framework import serializers
from .models import City, State, Country

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'country']
        read_only_fields = ['id', 'country']


class StateSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = State
        fields = ['id', 'state', 'country']
        read_only_fields = ['id', 'state', 'country']


class CitySerializer(serializers.ModelSerializer):
   
    class Meta:
        model = City
        fields = ['id', 'state', 'city', 'latitude', 'longitude']
        read_only_fields = ['id', 'state', 'city', 'latitude', 'longitude']
