from datetime import timedelta
from pathlib import Path
from typing import Optional
import django
from django.utils.encoding import force_str
from gqlauth.settings_type import GqlAuthSettings
from gqlauth.settings_type import email_field
# from strawberry.annotation import StrawberryAnnotation
# from strawberry.field import StrawberryField

django.utils.encoding.force_text = force_str

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-739@+h*%&0oa-t6d0iqlpo9b&dm7bui8g3lti6ss5bg3_z-2ny'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'django_extensions',
    'debug_toolbar',
    'strawberry_django_jwt',
    'strawberry_django_jwt.refresh_token',
    'strawberry_django_plus',
    'corsheaders',
    # 'gqlauth',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + [
    'core.apps.CoreConfig',
    'users.apps.UsersConfig',
    'questions.apps.QuestionsConfig',
]

# from django.contrib.sessions.middleware import SessionMiddleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'config.middleware.MyAuthenticationMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'strawberry_django_plus.middlewares.debug_toolbar.DebugToolbarMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'strawberry_django_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]

GRAPHQL_JWT = {
    "JWT_VERIFY_EXPIRATION": True,
    "JWT_LONG_RUNNING_REFRESH_TOKEN": True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=60*24),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
    "JWT_AUTHENTICATE_INTROSPECTION": True
}

GQL_AUTH = GqlAuthSettings(
    LOGIN_FIELDS=[email_field],
    REGISTER_MUTATION_FIELDS=[email_field],
    LOGIN_REQUIRE_CAPTCHA=False,
    REGISTER_REQUIRE_CAPTCHA=False,
    SEND_ACTIVATION_EMAIL=False,
    JWT_LONG_RUNNING_REFRESH_TOKEN=True,
    JWT_EXPIRATION_DELTA=timedelta(minutes=60*3),
    JWT_REFRESH_EXPIRATION_DELTA=timedelta(days=3),
)

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'qpgen',
        'USER': 'admin',
        'PASSWORD': 'admin',
        'HOST': 'qpgen-db',
        'PORT': '5432',
    }
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "/backend_static/"
STATIC_ROOT = BASE_DIR / "static"
MEDIA_URL = "/backend_media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.USER'

# CSRF_TRUSTED_ORIGINS = ['https://d396-2402-3a80-427a-36a-e5b6-4784-8f2f-49b9.in.ngrok.io']

CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    'http://127.0.0.1',
    'http://qpgen.lol',
)


INTERNAL_IPS = [
    "127.0.0.1",
    'localhost',
    '172.18.*',
    '172.18.0.5'
]

if DEBUG:
    import socket
    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS += [ip[:-1] + '1' for ip in ips]
