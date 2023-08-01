from datetime import timedelta
from pathlib import Path
import os
import django
import environ
from django.utils.encoding import force_str
from gqlauth.settings_type import GqlAuthSettings
from gqlauth.settings_type import email_field

# from strawberry.annotation import StrawberryAnnotation
# from strawberry.field import StrawberryField

django.utils.encoding.force_text = force_str

env = environ.Env()
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False if env("DEBUG") == "true" else False

ALLOWED_HOSTS = env("ALLOWED_HOSTS").split(" ")


# Application definition

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.sites",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "django_extensions",
    "debug_toolbar",
    "strawberry_django_jwt",
    "strawberry_django_jwt.refresh_token",
    "strawberry_django_plus",
    "corsheaders",
    "storages",
    "import_export",
    # 'gqlauth',
]

INSTALLED_APPS = (
    DJANGO_APPS
    + THIRD_PARTY_APPS
    + [
        "core.apps.CoreConfig",
        "users.apps.UsersConfig",
        "questions.apps.QuestionsConfig",
        "coe.apps.CoeConfig",
    ]
)

# from django.contrib.sessions.middleware import SessionMiddleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "config.middleware.MyAuthenticationMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "strawberry_django_plus.middlewares.debug_toolbar.DebugToolbarMiddleware",
]

AUTHENTICATION_BACKENDS = [
    "strawberry_django_jwt.backends.JSONWebTokenBackend",
    "django.contrib.auth.backends.ModelBackend",
]

GRAPHQL_JWT = {
    "JWT_VERIFY_EXPIRATION": True,
    "JWT_LONG_RUNNING_REFRESH_TOKEN": True,
    "JWT_EXPIRATION_DELTA": timedelta(minutes=60 * 24),
    "JWT_REFRESH_EXPIRATION_DELTA": timedelta(days=7),
    "JWT_AUTHENTICATE_INTROSPECTION": True,
}

GQL_AUTH = GqlAuthSettings(
    LOGIN_FIELDS=[email_field],
    REGISTER_MUTATION_FIELDS=[email_field],
    LOGIN_REQUIRE_CAPTCHA=False,
    REGISTER_REQUIRE_CAPTCHA=False,
    SEND_ACTIVATION_EMAIL=False,
    JWT_LONG_RUNNING_REFRESH_TOKEN=True,
    JWT_EXPIRATION_DELTA=timedelta(minutes=60 * 3),
    JWT_REFRESH_EXPIRATION_DELTA=timedelta(days=3),
)

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

if env('STORAGE').lower() == 'local':
    STATIC_URL = "/backend_static/"
    STATIC_ROOT = BASE_DIR / "static"
    MEDIA_URL = "/backend_media/"
    MEDIA_ROOT = BASE_DIR / "media"
else:
    STATIC_URL = "/backend_static/"

    STATICFILES_DIRS = [
        BASE_DIR / "static",  # os.path.join(BASE_DIR, 'static')
    ]

    STATIC_ROOT = BASE_DIR / "staticfiles-cdn"  # in production, we want cdn
    MEDIA_URL = "/backend_media/"

    MEDIA_ROOT = BASE_DIR / "staticfiles-cdn" / "uploads"

    from .cdn.conf import *

    # AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    # AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    # AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    # AWS_S3_ENDPOINT_URL = env("AWS_S3_ENDPOINT_URL")
    # AWS_LOCATION = env("AWS_LOCATION")
    # AWS_S3_OBJECT_PARAMETERS = {
    #     "CacheControl": "max-age=86400",
    # }
    # MEDIA_ROOT = BASE_DIR / "media"

    # STATIC_URL = "https://%s/%s/" % (AWS_S3_ENDPOINT_URL, AWS_LOCATION)
    # STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    # STATIC_ROOT = BASE_DIR / "static"
    # STATIC_ROOT = BASE_DIR / "static"
    # AWS_LOCATION = "your-spaces-files-folder"

    # from storages.backends.s3boto3 import S3Boto3Storage
    #
    # class StaticRootS3Boto3Storage(S3Boto3Storage):
    #     location = "static"
    #
    # class MediaRootS3Boto3Storage(S3Boto3Storage):
    #     location = "media"
    #
    # AWS_ACCESS_KEY_ID=os.environ.get("AWS_ACCESS_KEY_ID")
    # AWS_SECRET_ACCESS_KEY=os.environ.get("AWS_SECRET_ACCESS_KEY")
    # AWS_STORAGE_BUCKET_NAME=os.environ.get("AWS_STORAGE_BUCKET_NAME")
    # AWS_S3_ENDPOINT_URL="https://nyc3.digitaloceanspaces.com"
    # AWS_S3_OBJECT_PARAMETERS = {
    #     "CacheControl": "max-age=86400",
    # }
    # AWS_LOCATION = f"https://{AWS_STORAGE_BUCKET_NAME}.nyc3.digitaloceanspaces.com"
    #
    # DEFAULT_FILE_STORAGE = "config.settings.MediaRootS3Boto3Storage"
    # STATICFILES_STORAGE = "config.settings.StaticRootS3Boto3Storage"


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.USER"

# CSRF_TRUSTED_ORIGINS = ['https://d396-2402-3a80-427a-36a-e5b6-4784-8f2f-49b9.in.ngrok.io']

CORS_ORIGIN_ALLOW_ALL = False
# CORS_ORIGIN_WHITELIST = (
#     "http://127.0.0.1",
#     "http://qpgen.lol",
# )
if DEBUG:
    import socket

    INTERNAL_IPS = ["127.0.0.1", "localhost", "172.18.*", "172.18.0.5"]
    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS += [ip[:-1] + "1" for ip in ips]

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_USE_TLS = True
# EMAIL_PORT = 465
# EMAIL_HOST_USER = "dhanus3133@gmail.com"
# EMAIL_HOST_PASSWORD = env("EMAIL_PASSWORD")
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = env("EMAIL")
EMAIL_HOST_PASSWORD = env("EMAIL_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DOMAIN = env("DOMAIN")

SITE_ID = 1
