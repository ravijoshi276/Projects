from rest_framework.permissions import BasePermission

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

class IsDeliveryCrewOrUser(BasePermission):
    
    def has_permission(self, request, view):
        #Ensures Group named defined in view class
        if request.method =="GET":
            return True
        required_group = getattr('view','required_group',None)
        #Grants access if user is authenticated and is part of required group
        return (
            request.user and 
            (request.user.is_authenticated or
            request.user.groups.filter(name=required_group).exists())
        )


    
