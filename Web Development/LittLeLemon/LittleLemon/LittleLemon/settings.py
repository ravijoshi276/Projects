"""
Django settings for LittleLemon project.
Optimized for seamless Local Development & Render Production environments.
"""

import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load local environment variables from .env file if present
load_dotenv(os.path.join(BASE_DIR, '.env'))

# --- CRITICAL SECURITY CONFIGURATIONS ---

# Safe fallback logic: Production uses Render's dashboard variable, local uses .env value or unsafe default
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-%%z9wgkaqs#(_)ze)1*ee=m3e_4a1a6a2dp*fhh8%zlnsz%o2p')

#  Host Management
ALLOWED_HOSTS = []

if DEBUG:
    ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'little-lemon-backend-afqk.onrender.com']
else:
    render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if render_host:
        ALLOWED_HOSTS.append(render_host)
        ALLOWED_HOSTS.append(f"www.{render_host}")
# --- APPLICATION DEFINITION ---

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'LittleLemonDRF',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
]

# Dynamically inject Debug Toolbar only during local development
if DEBUG:
    INSTALLED_APPS.append('debug_toolbar')

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Append Debug Toolbar middleware dynamically if debugging
if DEBUG:
    MIDDLEWARE.append('debug_toolbar.middleware.DebugToolbarMiddleware')

INTERNAL_IPS = [
    '127.0.0.1',
]

ROOT_URLCONF = 'LittleLemon.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'LittleLemon.wsgi.application'


# --- SECURE DATABASE ROUTING ---

# If Render provides a pooled/direct connection string, use it; otherwise read standard keys from .env
if os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USERNAME'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST', 'localhost'), 
            'PORT': os.getenv("DB_PORT", '5432'),
        }
    }


# --- REST FRAMEWORK & DJOSER CONFIGURATIONS ---

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.OrderingFilter',
        'rest_framework.filters.SearchFilter',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    # Restrict production renderer strictly to JSON. Enable Browsable API only for development.
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ] if not DEBUG else [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE' : 100,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10/minute',      
        'user': '50/minute',    
    },
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ]
}

DJOSER = {
    'USER_ID_FIELD':'username',
    'LOGIN_FIELD': 'username',  
    'USER_CREATE_PASSWORD_RETYPE': True,
    
    'SERIALIZERS': {
        'user_create_password_retype': 'LittleLemonDRF.serializers.UserCreationSerializer',
        'current_user': 'LittleLemonDRF.serializers.CustomUserSerializer',
        'token': 'LittleLemonDRF.serializers.CustomTokenSerializer',
    }
}


# --- CORS CROSS-ORIGIN ACCESSIBILITY ---

# Read allowed domains from environment array if in production, use fallback locally
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
    ]
else:
    # Populates via string arrays like "https://vercel.app,https://littlelemon.com" on Render
    cors_env = os.environ.get("CORS_ALLOWED_ORIGINS", "")
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_env.split(",") if origin.strip()] if cors_env else []


# --- STATIC & MEDIA ASSETS SETUP ---

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

#  routing system format for WhiteNoise
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, '../', 'littlelemonfrontend', 'src', 'assets')


# --- INTERNATIONALIZATION & DEFAULT FIELD LOOKUPS ---

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'