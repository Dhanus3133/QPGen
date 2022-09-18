from django.contrib import admin
from django.conf.urls.static import static
from django.urls import include, path
from django.conf import settings
from strawberry.django.views import AsyncGraphQLView
from .schema import schema


urlpatterns = [
    path('admin/', admin.site.urls),
    path('vditor/', include('vditor.urls')),
    path('graphql/', AsyncGraphQLView.as_view(schema=schema)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
