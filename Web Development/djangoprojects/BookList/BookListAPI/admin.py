from django.contrib import admin
#Importing Model
from .models import Book

#Registering Model
admin.site.register(Book)