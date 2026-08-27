import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LittleLemon.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
# Change 'admin', 'admin@example.com', and 'password123' to whatever you want
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@littlelemon.com', 'SmritiTheMotu@5320')
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")
