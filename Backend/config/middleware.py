# from typing import cast
# from django.contrib.auth.middleware import (
#     AuthenticationMiddleware as _AuthenticationMiddleware,
#     SimpleLazyObject,
#     auth,
# )
# from django.core.handlers.asgi import HttpRequest
# from strawberry_django_jwt.utils import jwt_settings
#
#
# def _get_user(request: HttpRequest):
#     if not (user := getattr(request, "_cached_user", None)):
#         token: list[str] = request.headers.get(
#             cast(str, jwt_settings.JWT_AUTH_HEADER_NAME), ""
#         ).split()
#         if len(token) == 2 and token[0] == "JWT":
#             user = get_user_by_token(token[1], context=request)
#         if user is None:
#             user = auth.get_user(request)
#
#         assert user
#         setattr(request, "_cached_user", user)
#
#     return user
#
#
# class AuthenticationMiddleware(_AuthenticationMiddleware):
#     def process_request(self, request: HttpRequest):
#         request.user = SimpleLazyObject(lambda: _get_user(request))


from typing import cast
from django.contrib import auth
from django.contrib.auth.middleware import AuthenticationMiddleware
from django.core.handlers.asgi import HttpRequest
from django.utils.functional import SimpleLazyObject
from strawberry_django_jwt.settings import jwt_settings
from strawberry_django_jwt.shortcuts import get_user_by_token

_user_cache_key = "_cached_user"

def _get_user(request: HttpRequest):
    if not (user := getattr(request, _user_cache_key, None)):
        token: list[str] = request.META.get(
            cast(str, jwt_settings.JWT_AUTH_HEADER_NAME), ""
        ).split()
        if len(token) == 2 and token[0] == "JWT":
            user = get_user_by_token(token[1], context=request)
        if user is None:
            user = auth.get_user(request)

        assert user
        setattr(request, _user_cache_key, user)

    return user


class MyAuthenticationMiddleware(AuthenticationMiddleware):
    def process_request(self, request: HttpRequest):
        request.user = SimpleLazyObject(lambda: _get_user(request))
