# from asgiref.sync import sync_to_async
from django.contrib import admin
from django.conf.urls.static import re_path, static
from django.urls import include, path
from django.conf import settings
from django.views.static import serve

from strawberry_django_jwt.decorators import jwt_cookie
from strawberry_django_jwt.views import AsyncStatusHandlingGraphQLView as AGQLView
from questions.views import upload_question_image

# from strawberry_django_jwt.views import StatusHandlingGraphQLView as GQLView
# from strawberry.django.views import AsyncGraphQLView
from core import schema


urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", jwt_cookie(AGQLView.as_view(schema=schema.schema))),
    # path('graphql/', AsyncGraphQLView.as_view(schema=schema.schema)),
    path("upload/", upload_question_image),
    path("__debug__/", include("debug_toolbar.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    ) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns += [
        re_path(
            r"^backend_media/(?P<path>.*)$",
            serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
        re_path(
            r"^backend_static/(?P<path>.*)$",
            serve,
            {"document_root": settings.STATIC_ROOT},
        ),
    ]
