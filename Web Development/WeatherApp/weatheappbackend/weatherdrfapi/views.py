from rest_framework import generics
from rest_framework.response import Response
from django.core.cache import cache
from .models import State, City,Country
from .serializers import StateSerializer, CitySerializer,CountrySerializer

class CountryListView(generics.ListAPIView):
    serializer_class= CountrySerializer
    queryset = Country.objects.all()


class StateListView(generics.ListAPIView):
    serializer_class = StateSerializer

    def get_queryset(self):
       
        country_id = self.kwargs.get('country_id')
    
        if country_id>=0:
            return State.objects.filter(country_id=country_id)
        return State.objects.none()

    def list(self, request, *args, **kwargs):
        country_id = self.kwargs.get('country_id')
        if not country_id>=0:
            return Response([])

        cache_key = f"generic_states_country_{country_id}"
        cached_data = cache.get(cache_key)
        
        if cached_data is not None:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        
       
        cache.set(cache_key, response.data, 86400)
        return response


class CityListView(generics.ListAPIView):
    serializer_class = CitySerializer

    def get_queryset(self):
       
        state_id = self.kwargs.get('state_id')
        if state_id>=0:
            return City.objects.filter(state_id=state_id)
        return City.objects.none()

    def list(self, request, *args, **kwargs):
        state_id = self.kwargs.get('state_id')
        if not state_id>=0:
            return Response([])

        cache_key = f"generic_cities_state_{state_id}"
        cached_data = cache.get(cache_key)
        
        if cached_data is not None:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        
        cache.set(cache_key, response.data, 86400)
        return response
