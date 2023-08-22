from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls.static import static
from django.views.static import serve
from strawberry.django.views import AsyncGraphQLView
from core.schema import schema
from questions.views import upload_question_image

urlpatterns = [
    path('admin/', admin.site.urls),
    path("graphql/", AsyncGraphQLView.as_view(schema=schema, graphiql=settings.DEBUG)),
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
