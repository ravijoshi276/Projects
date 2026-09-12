from rest_framework.permissions import BasePermission
from .models import Reservation
class IsManager(BasePermission):
    
    def has_permission(self, request, view):
        #Ensures Group named defined in view class
        if request.method =="GET":
            return True
        #Grants access if user is authenticated and is part of required group
        return (
            request.user and 
            request.user.is_authenticated and
            request.user.groups.filter(name="Manager").exists()
        )

class ReserVationPermission(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = request.user
        is_Manager = user.groups.filter(name="Manager").exists()
        if not user.is_authenticated:
            return False
        new_status = request.data.get('status')

        if is_Manager:
            return True

        return (obj.user == user and new_status == Reservation.StatusChoices.CANCELLED and obj.status != Reservation.StatusChoices.CONFIRMED )

    
