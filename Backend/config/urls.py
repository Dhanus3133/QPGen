from django.contrib import admin
from django.conf.urls.static import static
from django.urls import include, path
from django.conf import settings
from strawberry.django.views import AsyncGraphQLView, GraphQLView
from strawberry_django_jwt.decorators import jwt_cookie
from strawberry_django_jwt.views import AsyncStatusHandlingGraphQLView as AGQLView
from strawberry_django_jwt.views import StatusHandlingGraphQLView as GQLView
from questions.schema import schema


urlpatterns = [
    path('admin/', admin.site.urls),
    path('vditor/', include('vditor.urls')),
    # path('graphql/', jwt_cookie(AGQLView.as_view(schema=schema))),
    path('graphql/', jwt_cookie(AGQLView.as_view(schema=schema))),
    path('__debug__/', include('debug_toolbar.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
