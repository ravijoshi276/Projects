from django.urls import path
from .views import StateListView,CountryListView,CityListView
urlpatterns = [
   path('countries/',CountryListView.as_view(),name='county'),
   path('countries/<int:country_id>/states/',StateListView.as_view(),name='county-state'),
   path('states/<int:state_id>/cities/',CityListView.as_view(),name='state-cities'),
   
]